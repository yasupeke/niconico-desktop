var packager = require('electron-packager');  
var config = require('./package.json');

packager(
    {  
        dir: './',          // 対象
        out: './package',      // 出力先
        name: config.name,  // 名前
        platform: 'win32', // 対象OS
        arch: 'x64',        // 64bit
        version: '1.2.8',  // electron のバージョン
        //icon: './app.icns', // アイコン

        //'app-bundle-id': 'jp.phi.electron-app', // ドメイン
        'app-version': config.version,          // バージョン

        overwrite: true,  // 上書き
        asar: true,       // アーカイブ
        prune: true,
        // 無視ファイル
        ignore: "node_modules/(electron-packager|electron-prebuilt|\.bin)|release\.js",
    },
    function done (err, appPath) {
        if(err) {
            throw new Error(err);
        }
        console.log('Done!!');
    }
);

