/* Settings here override default values from constants.js;for example: */
 
    urls['AUDIO_good'] = '/xul/server/skin/media/custom/Good.wav';

    urls['AUDIO_circ_good'] = '/xul/server/skin/media/custom/toggled2.wav';

    urls['AUDIO_special_checkin.cataloging'] = '/xul/server/skin/media/custom/Cataloging.wav';
    urls['AUDIO_special_checkin.error'] = '/xul/server/skin/media/custom/Error.wav';
    urls['AUDIO_special_checkin.hold_capture_delayed'] = '/xul/server/skin/media/custom/HoldCaptureDelay.wav';
    urls['AUDIO_special_checkin.hold_shelf'] = '/xul/server/skin/media/custom/HoldShelf.wav';
    urls['AUDIO_special_checkin.no_change'] = '/xul/server/skin/media/custom/NoChange.wav';
    urls['AUDIO_special_checkin.not_found'] = '/xul/server/skin/media/custom/NotFound.wav';
    urls['AUDIO_special_checkin.reservation_shelf'] = '/xul/server/skin/media/custom/ReservationShelf.wav';
    urls['AUDIO_special_checkin.success'] = '/xul/server/skin/media/custom/Success.wav';
    urls['AUDIO_special_checkin.transit'] = '/xul/server/skin/media/custom/Transit.wav';
    urls['AUDIO_special_checkin.transit_for_hold'] = '/xul/server/skin/media/custom/TransitforHold.wav';
/*
    urls['opac'] = '/opac/' + LOCALE + '/skin/mylib/xml/advanced.xml?nps=1';
    urls['opac_rdetail'] = '/opac/' + LOCALE + '/skin/mylib/xml/rdetail.xml';
    urls['opac_rresult'] = '/opac/' + LOCALE + '/skin/mylib/xml/rresult.xml';
    urls['browser'] = '/opac/' + LOCALE + '/skin/mylib/xml/advanced.xml?nps=1';

*/

// Debugging aids.  _dump_level = 4 enables all dump statements
try {
    var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces['nsIPrefBranch']);
    if (prefs.prefHasUserValue('oils.dump_level')) {
        _dump_level = prefs.getIntPref('oils.dump_level');
    }
} catch(E) {
    dump('Error setting _dump_level in custom.js for ' + location.href + '\n');
}

var _dump_prefix = '0';
try {
    var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces['nsIPrefBranch']);
    if (!prefs.prefHasUserValue('oils.unique_id')) {
        prefs.setIntPref('oils.unique_id',Number(_dump_prefix));
    } else {
        var temp = prefs.getIntPref('oils.unique_id') + 1;
        prefs.setIntPref('oils.unique_id',temp);
        _dump_prefix = String( temp );
        switch( temp % 5 ) {
            case 0: _dump_prefix = '!! ' + _dump_prefix; break;
            case 1: _dump_prefix = '@@ ' + _dump_prefix; break;
            case 2: _dump_prefix = '## ' + _dump_prefix; break;
            case 3: _dump_prefix = '$$ ' + _dump_prefix; break;
            case 4: default: _dump_prefix = '%% ' + _dump_prefix; break;
        }
    }
    dump(' >>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + _dump_prefix + ' = ' + location.href + '\n');
} catch(E) {
    dump('Error in custom.js trying to set oils.unique_id\n');
}

function dump_xulG(msg) {
    dump('[[[[[[[[[[[[[[[[[[[[[[[[[[[[[\n');
    dump(msg +'\n');
    if (xulG) {
        for (var i in xulG) {
            dump('xulG['+i+'] = '+xulG[i]+'\n');
        }
    } else {
        dump('no xulG\n');
    }
    dump(']]]]]]]]]]]]]]]]]]]]]]]]]]]]]\n');
}
