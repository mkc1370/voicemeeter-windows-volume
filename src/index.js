// imports *********************************************************************

// built-in
import os from 'os';
import path from 'path';

// external
import SysTray from 'systray2';

// local
import { PRIORITIES } from './lib/processManager';
import { setupPersistantSystray } from './lib/persistantSysTray';
import { startAudioSync } from './lib/audioSyncManager';

// menu items
import { itemListBindings } from './menuItems/itemListBindings';
import { itemListPatches } from './menuItems/itemListPatches';
import { itemRestartVoicemeeter } from './menuItems/itemRestartVoicemeeter';
import { itemRestartAudioEngine } from './menuItems/itemRestartAudioEngine';
import { itemVisitGithub } from './menuItems/itemVisitGithub';
import { itemDonate } from './menuItems/itemDonate';
import { itemExit } from './menuItems/itemExit';
import { STRING_MENU_ITEMS } from './lib/strings';
import { itemShowVoicemeeter } from './menuItems/itemShowVoicemeeter';

// configuration ***************************************************************

// default settings
const defaults = {
    polling_rate: 100,
    gain_min: -60,
    gain_max: 12,
    start_with_windows: true,
    limit_db_gain_to_0: false,
    restart_audio_engine_on_device_change: true,
    remember_volume: false,
    disable_donate: false,
    audiodg: {
        priority: PRIORITIES.HIGH,
        affinity: 2,
    },
};
const settingsPath = `${__dirname}/settings.json`;

// tray app menu
const trayApp = {
    menu: {
        icon:
            os.platform() === 'win32'
                ? path.normalize(__dirname + '/assets/app.ico')
                : path.normalize(__dirname + '/assets/app.png'),
        title: 'Voicemeeter Windows Volume',
        tooltip: 'Voicemeeter Windows Volume',
        items: [
            { title: STRING_MENU_ITEMS['itemAppTitle'], enabled: false },
            itemListBindings(),
            itemListPatches(),
            SysTray.separator,
            { title: STRING_MENU_ITEMS['itemVMTitle'], enabled: false },
            itemShowVoicemeeter(),
            itemRestartVoicemeeter(),
            itemRestartAudioEngine(),
            SysTray.separator,
            { title: STRING_MENU_ITEMS['itemSupportTitle'], enabled: false },
            itemVisitGithub(),
            itemDonate(),
            SysTray.separator,
            itemExit({
                click: () => {
                    process.exit();
                },
            }),
        ],
    },
    debug: false,
    copyDir: true, // this is required since we're compiling to an exe
};

// initialize the tray app *****************************************************

const systray = setupPersistantSystray({
    trayApp,
    defaults,
    settingsPath,
    onReady: () => {
        console.log('Starting audio synchronization');
        startAudioSync();
    },
});
