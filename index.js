const { readdirSync, readFileSync, writeFileSync, createReadStream } = require('fs')
const { join } = require('path')
var request
try {
	request = require('request')
} catch(ex) {
	console.log('Installing `request` which is needed for this to work')
	require('child_process').execSync('npm i request --save')
	require('child_process').exec('npm start').stdout.on('data', (m) => {
		let data = String(m).split('\n')
		data.pop()
		console.log(data.join('\n'))
	})
	return;
}

const opts = require('./settings.json')
console.log(JSON.stringify(opts,null,2))

const scripts = readdirSync('Scripts').entries()
let script = scripts.next()
let i = setInterval(() => {
	if (!script.value) {
		clearInterval(i)
		return
	}
	let [index, file] = script.value
	console.log(`Obfuscating ${file}...`)
	request({
		uri: 'https://obfuscator.aztupscripts.xyz/Obfuscate',
		method: 'POST',
		formData: {
			Input: {
				value: createReadStream(join(__dirname, 'Scripts', file)),
				options: {
					filename: file,
					contentType: 'application/octet-stream'
				},
			},
			NoControlFlow: opts.NoControlFlow ? 'on' : 'off',
			NoBytecodeCompress: opts.NoBytecodeCompress ? 'on' : 'off',
			EncryptStrings: opts.EncryptStrings ? 'on' : 'off',
			EncryptImportantStrings: opts.EncryptImportantStrings ? 'on' : 'off',
			PreserveLineInfo: opts.PreserveLineInfo ? 'on' : 'off',
			AddMemes: opts.AddMemes ? 'on' : 'off',
			Uglify: opts.Uglify ? 'on' : 'off',
			CustomVarName: opts.CustomVarName
		}
	}, function(err,res,body) {
		writeFileSync('Obfuscated Scripts/'+file, body)
	})
	script = scripts.next()
}, 1500)