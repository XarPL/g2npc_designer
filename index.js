var GIF = require('gl-gif'); 

var clipboard = new ClipboardJS('.btn');

var container, controls;
var camera, scene, renderer;
var bodyid,headid;
var curr_bodytex, curr_headtex, curr_bodymodel, curr_headmodel, curr_outfit;
var outfit = true;
var loaded = false;

var speed = 1.0;

var permalink;

var noop = function() {};
var renderGif = noop;

init();
if (window.location.hash) {
	permalink = window.location.hash.substring(1).split('-');
	[curr_bodymodel, 
	 curr_headmodel, 
	 curr_outfit, 
 	 curr_bodytex, 
	 curr_headtex,
	 outfit] = permalink;
	 document.getElementById("range0").value = curr_bodymodel;
	 document.getElementById("range1").value = curr_headmodel;
	 document.getElementById("range6").value = curr_outfit;
	 document.getElementById("range3").value = curr_bodytex;
	 document.getElementById("range4").value = curr_headtex;
	 document.getElementById("check2").checked = (outfit == 'true');

}
updateCode();

animate();

function refreshNPC()
{
	var loader = new THREE.TDSLoader( );
	var tgaloader = new THREE.TGALoader();
	if (document.getElementById("range6").value > 0 && outfit == true)
	{
		var addtexture = tgaloader.load( 'models/textures/armors/armor'+document.getElementById("range6").value+'_add.tga' );
		var addmaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, map: addtexture } );
		var bodytexture = tgaloader.load( 'models/textures/Hum_Body_Naked_V'+document.getElementById("range3").value+'_C0.tga' );
		var bodymaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, map: bodytexture } );
		var texture = tgaloader.load( 'models/textures/armors/armor'+document.getElementById("range6").value+'.tga' );
		var material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture } );
		loader.load( 'models/armors/armor'+document.getElementById("range6").value+'.3ds', function ( object ) {
			object.name = "body";
			object.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {
					if (child.material.name == "BODYMATERIAL")
					{
						child.material = bodymaterial;
					}else if (child.material.name == "ADD_MATERIAL")
					{
						child.material = addmaterial;
					}
					else
					{
						child.material = material;
					}
				}

			} );
			bodyid = object.id;
			scene.add( object );
		});
	}else
	{
	var texture = tgaloader.load( 'models/textures/Hum_Body_Naked_V'+document.getElementById("range3").value+'_C0.tga' );
	var material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture } );
	loader.load( 'models/body/body'+document.getElementById("range0").value+'.3ds', function ( object ) {
		object.name = "body";
		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {
				if (child.material.name == "BODYMATERIAL")
				{
					child.material = material;
				}
			}

		} );
		bodyid = object.id;
		scene.add( object );
	});
	}
	var loader2 = new THREE.TDSLoader( );
	var tgaloader = new THREE.TGALoader();
	var texture2 = tgaloader.load( 'models/textures/faces/Hum_Head_V'+document.getElementById("range4").value+'_C0.tga' );
	var material2 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture2 } );
	loader2.load( 'models/head/'+document.getElementById("range1").value+'.3ds', function ( object ) {
		object.name = "head";
		object.rotation.z = 1.57;
		object.rotation.y = 1.57;
		object.position.y = 0.68;
		object.traverse( function ( child ) 
		{
			if ( child instanceof THREE.Mesh ) 
			{
				child.material = material2;
			}
		} 
		);
		headid = object.id;
		scene.add( object );
	});
	loaded = true;
}
function init() 
{
	container = document.getElementById( 'render' );
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth/4 / (window.innerHeight-100), 0.1, 10 );
	camera.position.z = 2;
	camera.position.y = -0.2;
	scene = new THREE.Scene();
	scene.add( new THREE.HemisphereLight() );
	curr_bodytex = 0;
	curr_headtex = 0;
	curr_bodymodel = document.getElementById("range0").value;
	curr_headmodel = document.getElementById("range1").value;
	curr_outfit = document.getElementById("range6").value;
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth/4, window.innerHeight-100 );
	container.appendChild( renderer.domElement );
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.addEventListener( 'change', render );
	window.addEventListener( 'resize', resize, false );
	loaded = true;
}

function resize(width, height) 
{
	var width = width || (window.innerWidth/4);
	var height = height || (window.innerHeight-100);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize( width, height );
}
function render() 
{
	if (headid != -1 && bodyid != -1)
	{
		var bodymesh = new THREE.Object3D();
		var headmesh = new THREE.Object3D();
		for ( var i = 0, l = scene.children.length; i < l; i ++ ) 
		{
			var child = scene.children[ i ]; 
			if ( child.id == bodyid ) 
			{ 
				bodymesh = child; 
			}
			else if ( child.id == headid ) 
			{ 
				headmesh = child; 
			}
		}
		if (document.getElementById("check1").checked == true)
		{
			bodymesh.rotation.y -= speed * 0.02617993877991494;
			headmesh.rotation.y -= speed * 0.02617993877991494;
		}else{
			bodymesh.rotation.y = -0.6;
			headmesh.rotation.y = 1.57/2;
		}
		bodymesh.scale.z = document.getElementById("range2").value;
		var tgaloader = new THREE.TGALoader();
		/*if (curr_bodytex != document.getElementById("range3").value)
		{
			var texture = tgaloader.load( 'models/textures/Hum_Body_Naked_V'+document.getElementById("range3").value+'_C0.tga' );
			var material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture } );
			bodymesh.traverse( function ( child ) {

					if ( child instanceof THREE.Mesh) {
						if (child.material.name == "BODYMATERIAL")
						{
						child.material = material;
						}
					}

				} );
				curr_bodytex = document.getElementById("range3").value
		}*/
		if (curr_headtex != document.getElementById("range4").value)
		{
			var texture2 = tgaloader.load( 'models/textures/faces/Hum_Head_V'+document.getElementById("range4").value+'_C0.tga' );
			var material2 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture2 } );
			headmesh.traverse( function ( child ) {

					if ( child instanceof THREE.Mesh) {
						child.material = material2;
					}

				} );
				curr_headtex = document.getElementById("range4").value
		}
		if (curr_bodytex != document.getElementById("range3").value || curr_bodymodel != document.getElementById("range0").value || curr_headmodel != document.getElementById("range1").value || curr_outfit != document.getElementById("range6").value||outfit != document.getElementById("check2").checked)
		{
			if (loaded)
			{
				scene.remove(bodymesh);
				scene.remove(headmesh);
				bodyid = -1;
				headid = -1;
				loaded = false;
				curr_bodymodel = document.getElementById("range0").value;
				curr_headmodel = document.getElementById("range1").value;
				curr_outfit = document.getElementById("range6").value;
				curr_bodytex = document.getElementById("range3").value
				outfit = document.getElementById("check2").checked
				setTimeout(refreshNPC,100);
				//refreshNPC();		
			}
		}
		renderer.render( scene, camera );
	}
}
function updateCode()
{
	var v1, v2, v3, armorname;
	if (curr_bodymodel == 1)
	{ 
		v1 = "FEMALE"; 
		document.getElementById( 'label1' ).innerHTML = "Model ciała: Żeński";
	}
	else 
	{
		v1 = "MALE";
		document.getElementById( 'label1' ).innerHTML = "Model ciała: Męski";
	}
	
	switch (curr_headmodel)
	{
		case '1':
			v2 = "HUM_HEAD_BABE";
			break;
		case '2':
			v2 = "HUM_HEAD_BABE1";
			break;
		case '3':
			v2 = "HUM_HEAD_BABE2";
			break;
		case '4':
			v2 = "HUM_HEAD_BABE3";
			break;
		case '5':
			v2 = "HUM_HEAD_BABE4";
			break;
		case '6':
			v2 = "HUM_HEAD_BABE5";
			break;
		case '7':
			v2 = "HUM_HEAD_BABE6";
			break;
		case '8':
			v2 = "HUM_HEAD_BABE7";
			break;
		case '9':
			v2 = "HUM_HEAD_BABE8";
			break;
		case '10':
			v2 = "HUM_HEAD_BABEHAIR";
			break;
		case '11':
			v2 = "HUM_HEAD_BALD";
			break;
		case '12':
			v2 = "HUM_HEAD_FATBALD";
			break;
		case '13':
			v2 = "HUM_HEAD_FIGHTER";
			break;
		case '14':
			v2 = "HUM_HEAD_PONY";
			break;
		case '15':
			v2 = "HUM_HEAD_PSIONIC";
			break;
		case '16':
			v2 = "HUM_HEAD_THIEF";
			break;
		default:
			v2 = "HUM_HEAD_PONY";
	}
	switch (curr_outfit)
	{
		case '0':
			v3 = "0";
			armorname = "Brak";
			break;
		case '1':
			v3 = "ITAR_BAU_L";
			armorname = "Strój farmera I";
			break;
		case '2':
			v3 = "ITAR_BAU_M";
			armorname = "Strój farmera II";
			break;
		case '3':
			v3 = "ITAR_BauBabe_L";
			armorname = "Suknia farmerki I";
			break;
		case '4':
			v3 = "ITAR_BauBabe_M";
			armorname = "Suknia farmerki II";
			break;
		case '5':
			v3 = "ITAR_VlkBabe_L";
			armorname = "Suknia obywatelki I";
			break;
		case '6':
			v3 = "ITAR_VlkBabe_M";
			armorname = "Suknia obywatelki II";
			break;
		case '7':
			v3 = "ITAR_VlkBabe_H";
			armorname = "Suknia obywatelki III";
			break;
		case '8':
			v3 = "ITAR_VLK_L";
			armorname = "Strój obywatela I";
			break;
		case '9':
			v3 = "ITAR_VLK_M";
			armorname = "Strój obywatela II";
			break;
		case '10':
			v3 = "ITAR_VLK_H";
			armorname = "Strój obywatela III";
			break;
		case '11':
			v3 = "ITAR_Leather_L";
			armorname = "Skórzany pancerz";
			break;
		case '12':
			v3 = "ITAR_Governor";
			armorname = "Kaftan gubernatora";
			break;
	}
	document.getElementById( 'label2' ).innerHTML = "Model głowy: "+v2;
	document.getElementById( 'label3' ).innerHTML = "Textura ciała: "+curr_bodytex;
	document.getElementById( 'label4' ).innerHTML = "Textura twarzy: "+curr_headtex;
	document.getElementById( 'label5' ).innerHTML = "Grubość: "+document.getElementById("range2").value;
	document.getElementById( 'label6' ).innerHTML = "Strój: "+armorname;
	document.getElementById( 'code' ).value = 'B_SetNpcVisual 	(self, '+v1+', "'+v2+'", '+curr_headtex+', '+curr_bodytex+', '+v3+');\nMdl_SetModelFatness (self, '+document.getElementById("range2").value+');';

	permalink = [
		curr_bodymodel, 
		curr_headmodel, 
		curr_outfit, 
		curr_bodytex, 
		curr_headtex,
		outfit].join('-');
	window.location.hash = permalink;
}

$("#generate-gif").click(function() {

	$("#render-progress-bar-container").removeAttr("hidden");

	$(".progress-bar-animated").css("width", "0%");
	$(".progress-bar-animated small").text("");

	$("#check1").prop('checked', true);

	var width = 175;
	var height = 300;

	var frames = 60;
	var counter = 0;

	speed = 4.0

	resize(width, height);

	var gif = GIF(renderer.context, {
		fps: 40,
		width: width,
		height: height,
		quality: 20,
		dither: true
	});

	renderGif = function() {
		if (++counter < frames) {
			gif.tick();
			var progress = Math.ceil((counter * 100.0) / (frames-1)) + "%";
			$("#render-progress-bar").css("width", progress);
			$("#render-progress-bar small").text("Rendering: " + progress);
		} else {
			speed = 1.0;
			resize();
			uploadGif(gif);
			renderGif = noop;
			$("#render-progress-bar small").text("Rendering complete!");
		}
	}
});


function uploadGif(gif) {
	$("#upload-progress-bar-container").removeAttr("hidden");

	var raw_gif = gif.done({format: "raw"});
	var gif_blob = new Blob([raw_gif], { type: 'image/gif' })

	var formData = new FormData();
	formData.append("file", gif_blob);
	formData.append("title", "test gif gothic");
	formData.append("tags", ["Gothic 2 NPC Designer"]);	

	var updateProgress = function (percentage) {
		$("#upload-progress-bar").css("width", percentage + "%");
		var text = (percentage == 100) 
			? "Uploading complete!" 
			: "Uploading: " + percentage + "%";
		$("#upload-progress-bar small").text(text);
	}

	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
	    if (request.readyState == XMLHttpRequest.DONE) {
	    	var json = JSON.parse(request.responseText);
	    	var link = json.success ? json.success.files.gif : "Error occured!";
	    	console.log(request.responseText);
	    	updateProgress("100");
	    	$("#gif-link-container").removeAttr("hidden");
	    	$("#gif-link").val(link);
	    }
	}

	request.upload.addEventListener("progress", function(evt){
		if (evt.lengthComputable) 
		{
			var complete = Math.ceil(evt.loaded * 100.0 / evt.total);
			updateProgress(complete);
		} 
    }, false);

	request.open("POST", "https://api.gifs.com/media/upload");
	request.send(formData);
}

function animate() {
	render();
	renderGif();
	updateCode();
	requestAnimationFrame( animate );
}