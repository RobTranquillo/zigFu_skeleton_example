/******************************************************************************************************************************************

This script shows in a div called 'radar'  the first person tracked by the kinect, by bulding up a skeleton of some moving divs

--- div's ---
radar								:	the box that contains one tracked person
skeleton_frame					:	a container to put all skeletjoint into and delete them together

--- functions ---
onuserfound						: 	callback function, occours from zigfu
onuserlost							: 	callback function, occours from zigfu
ondataupdate					: 	callback function, occours from zigfu
createSkeleton					:	creates the object for the all skeleton-joint-objects and all skeleton-joints	
createSkeletonElement		: 	creates an new joint into the skeleton frame. Requires: position, destinationDivName
updateSkeleton					:	if a new human position was tracked, set this one to the skeleton (all joints) 
destroySkeleton					:	removes all divs from the radar

--- variables ---
zrange								:	radar object property
xrange								:	radar object property
radar								:	object of the so called div-object
radar.pixelwidth					:	object propert, width of the radar
radar.pixelheight				:	object propert, height of the radar
skeleton							:	object from zigFu, contains all skeletondata (only available if "user.skeletonTracked == true")
skeleton.pos						:	skeleton object property, contains xyz position of the user
skeleton.frame					:	skeleton object property of the so called div-object, (equal to: "var el = user.radarelement;")
skeleton.joints[]					:	object, contains all joints of 
	
******************************************************************************************************************************************/

/**  global variables **/
var skeleton = new Object;
var xrange = 4000;
var yrange = 4000;
var radar = new Object;
var divwidth = 400; /** enter here the size of your outputdiv **/
var divheigth = 400; /** enter here the size of your outputdiv **/
var zoomfaktorx = 2800 / divwidth;
var zoomfaktory = 2800 / divheigth;
var radardiv;
jointsArray = new Array( 'Head','Neck','Torso','Waist','LeftShoulder','LeftElbow','LeftWrist','RightShoulder','RightElbow','RightWrist','LeftHip','RightHip' );  
	/** 
	full array of all possible joints provided by ZigFu:		
	jointsArray = new Array( 'Head','Neck','Torso','Waist','LeftCollar','LeftShoulder','LeftElbow','LeftWrist','LeftHand','LeftFingertip','RightCollar','RightShoulder','RightElbow','RightWrist','RightHand','RightFingertip','LeftHip','LeftKnee','LeftAnkle','LeftFoot','RightHip','RightKnee','RightAnkle','RightFoot' ); 
	**/


/**  function entry point, starts if document is loaded **/
function loaded() {
radardiv = document.getElementById('radar');


// The radar object will respond to events from the 
// zig object and move the dots around accordingly.
// It is also responsible for creating and destroying 
// the dots when users are added and removed.
// Functions onnewuser(), onlostuser(), and ondataupdate() 
// are called by the zig object when those things happen
radar = {
	onuserfound: function ( user ) {
		createSkeleton( user );		
	},
	onuserlost: function () {
		destroySkeleton();
	},
	ondataupdate: function (zigdata) {
		updateSkeleton( zigdata );
	}
};

// Add the radar object as a listener to the zig object, so that 
// the zig object will call the radar object's callback functions.
zig.addListener(radar);
}
document.addEventListener('DOMContentLoaded', loaded, false);

	/** places all skeleton joints by the kinect provided data **/
	function updateSkeleton( zigdata )
	{		
		for (var userid in zigdata.users) {
			var user = zigdata.users[userid];		
		
			if( user.skeletonTracked == true)
			{											
				for( joint in jointsArray)
				{
					var bodyPartName =  jointsArray[joint] ;
					var bodyPart =  zig.Joint[ bodyPartName ];	
					
					/** if some bodyparts can not recognized, break up the painting of the skeleton **/
					/** attention! If you insert all 23 possible  joints, you only will somthing if the full body is recognized by zigFu **/
					if( user.skeleton[bodyPart] + '' == 'undefined') return; //if some bodyparts can not recognized, break up the painting of the skeleton
				
					/** 
					calculation to fit the kinect pos.-data into every div:
					Kinect outputs x,y,z Numbers from -1400 - +1400. So i shift this range into positiv umberspace by adding 1400. Then calc an zoom-to-div-factor: 2800/div-size.
					And finaly calc kinect-positiv-data / zoomfactor = div-position				
					**/
					var pos = user.skeleton[bodyPart].position;
					var left = (pos[0] + 1400) / zoomfaktorx;
					var top = divheigth - (pos[1] + 1400) / zoomfaktory;			
					
					skeleton.joints[bodyPartName].style.left = left+ "px";
					skeleton.joints[bodyPartName].style.top = top + "px";			
				}	
			}
		}
	}


	/** create a new div as a skeleton joint **/
	function createSkeletonElement( jointName )
	{
		skeleton.joints[jointName] = document.createElement('div');
		skeleton.joints[jointName].className = 'skeletonJoints'
		skeleton.joints[jointName].id = 'skeleton_' + jointName;
		skeleton.frame.appendChild( skeleton.joints[jointName] );		
	}

	/** encapsulate the creation of the skeleton-div-frame and all skeleton joints in it **/
	function createSkeleton()
	{	
		if( document.getElementById('skeletonFrame') )  return; // just print only one skeleton
		
		/** create a frame to get all joints together by selecting one element**/
		skeleton.frame = document.createElement('div');
		skeleton.frame.className = 'skeletonFrame';
		skeleton.frame.id = 'skeletonFrame';
		radardiv.appendChild( skeleton.frame );
		
		/** create the object that contains all joints **/
		skeleton.joints = new Object;
				
		/** create all joints, with his name **/
		for( jt in jointsArray )	createSkeletonElement( jointsArray[jt] );
	}

	/** removes all divs fom the radar-div **/
	function destroySkeleton()
	{
		radardiv.removeChild( skeleton.frame );
	}