function GetPluginSettings()
{
	return {
	    "name": "copperlicht3d",
	    "id": "copperlicht3d",
		"version":		"1.0",
		"description": "Use copperlicht to display a 3d scene and manipulate its 3d elements.",
		"author":		"JPT",
		"help url":		"",
		"category":		"3D",
		"type":			"object",			// not in layout
		"rotatable":	false,
		"flags":		0,
		"dependency": "copperlicht.js"
	};
};

//////////////////////////////////////////////////////////////
// Conditions
AddCondition(0, cf_trigger, "On Scene Loaded", "copperlicht3d", "On Scene Loaded", "On Scene Loade.", "OnSceneLoaded");

//
AddCondition(1, 0, "Did collision with camera ray and nodes occur?", "collisions", "Did collision with camera ray and nodes occur?", "Did collision with camera ray and nodes occur?", "collision_nodes_with_camera_ray_occurred");

AddCondition(2, 0, "Did collision with static meshes and camera ray occur?", "collisions", "Did collision with static meshes and camera ray occur?", "Did collision with static meshes and camera ray occur?", "collision_static_with_camera_ray_occurred");

AddCondition(3, cf_trigger, "On Proximity", "collisions", "On Proximity", "On Proximity.", "OnProximity");

//////////////////////////////////////////////////////////////
// Actions

AddNumberParam("index_to_assign", "In which slot to put the object reference", "0");
AddStringParam("name_of_node", "name_of_node", "\"\"");
AddAction(0, 0, "Add Managed Node", "Scene Nodes", "Add Managed Node {1} into slot {0}", "Stores a 3D node into an array, so that we can operate on that node by using the index (faster than by looking up the object by name).", "AddManagedNode");

AddNumberParam("object_index", "Which slot has the object reference", "0");
AddAction(1, 0, "Destroy Managed Node", "Scene Nodes", "Destroy Managed Node from slot {0}", "Destroys a 3D node from array.", "DestroyManagedNode");

AddNumberParam("index_to_clear", "Which slot has the object reference", "0");
AddAction(2, 0, "Clear Managed Node", "Scene Nodes", "Clear Managed Node from slot {0}", "Clear a 3D node from array.", "ClearManagedNode");

AddNumberParam("object_index", "Which slot has the object reference", "0");
AddNumberParam("x", "", "0");
AddNumberParam("z", "", "0");
AddAction(3, 0, "Set Node Position", "Transform", "Set Node {0} to Position (x: {1},z: {2})", "Set Node Position.", "SetNodePosition");

AddNumberParam("object_index", "Which slot has the object reference", "0");
AddNumberParam("x", "", "0");
AddNumberParam("y", "", "0");
AddNumberParam("z", "", "0");
AddAction(4, 0, "Set Node Angle", "Transform", "Set Node {0} to Angle (x: {1},y: {2},. z: {3})", "Set Node Angle per axes in degress.", "SetNodeAngle");


AddNumberParam("object_index", "Which slot has the object reference", "0");
AddComboParamOption("Visible");
AddComboParamOption("Invisible");
AddComboParam("Visibility", "");
AddAction(5, 0, "Set Managed Node Visibility", "Scene Nodes", "Set Managed Node {0} Visibility to {1}", "3D node Visibility.", "SetManagedNodeVisibility");

AddStringParam("scene_path", "", "\"\"");
AddAction(6, 0, "Load scene from url", "Scene", "Load Scene {0}", "Load scene from url.", "LoadScene");


AddStringParam("camera_name", "The name of the camera node", "\"\"");
AddNumberParam("x", "", "0");
AddNumberParam("y", "", "0");
AddNumberParam("z", "", "0");
AddAction(7, 0, "Set Camera Target", "Transform", "Set {0} Target to ({1}, {2}, {3})", "Set Camera Target", "SetCameraTarget");

AddNumberParam("object_index", "Which slot has the object reference", "0");
AddStringParam("animation_name", "Name of the animation", "\"\"");
AddComboParamOption("Loop");
AddComboParamOption("No Loop");
AddComboParam("loop_animation", "");
AddAction(8, 0, "Node Play Animation", "Scene Nodes", "Set Node {0} Animation to {1} ({2})", "3D node Animation.", "NodePlayAnimation");

AddNumberParam("object_index_to_clone", "Which slot has the object reference to clone", "0");
AddNumberParam("new_object_index", "Which slot has the object reference to put the new node in", "0");
AddAction(9, 0, "Clone Managed Node", "copperlicht3d", "Clone Managed Node in {0} to {1}", "Clone Managed Node.", "CloneManagedNode");

AddNumberParam("object_index", "Which slot has the object reference", "0");
AddNumberParam("y", "", "0");
AddAction(10, 0, "Set Node Position Y", "Transform", "Set Node {0} Y to {1}", "Set Node Position Y.", "SetNodePositionY");


AddNumberParam("object_index", "Which slot has the object reference", "0");
AddNumberParam("x", "", "1");
AddNumberParam("y", "", "1");
AddNumberParam("z", "", "1");
AddAction(11, 0, "Set Node Scale", "Transform", "Set Node {0} Scale to ({1}, {2}, {3})", "Set Node Scale", "SetNodeScale");

AddNumberParam("new_object_index", "Which slot will have the new cube reference", "0");
AddNumberParam("x", "Initial X", "0");
AddNumberParam("y", "Initial Y", "0");
AddNumberParam("z", "Initial Z", "0");
AddStringParam("texture_path", "Path to the cube's texture", "\"\"");
AddAction(12, 0, "Create Cube", "Scene Nodes", "Create cube {0} at (x: {1},y: {2},. z: {3}) with texture {4}", "Create cube.","CreateCube");


AddNumberParam("global_scale", "Scale used when setting the position of nodes (1: the same, 2: twice as big, etc), this will be use to convert Construct2's coordiantes to Copperlicht's", "1");
AddAction(13, 0, "Set Position scale", "Global", "Set Position Scale to {0}", "Set Position Scale.", "SetScale");


AddNumberParam("object_index", "Which slot has the object reference", "0");
AddNumberParam("material_idx", "material index", "0");
AddComboParamOption("None");
AddComboParamOption("Dynamic");
AddComboParam("new_light_mode", "Lighting");
AddAction(14, 0, "Set Node Material Lighting", "Lighting", "Set Node {0} Material {1} Lighting to {2}", "Set Node Material Lighting.", "SetMaterialLighting");

AddNumberParam("object_index", "Which slot will contain the object reference", "0");
AddNumberParam("x", "", "0");
AddNumberParam("y", "", "0");
AddNumberParam("z", "", "0");
AddNumberParam("alpha", "Percentage from 0 to 1", "1");
AddNumberParam("blue", "Percentage from 0 to 1", "1");
AddNumberParam("green", "Percentage from 0 to 1", "1");
AddNumberParam("red", "Percentage from 0 to 1", "1");
AddNumberParam("attenuation", "Percentage from 0 to 1", "0.01");
AddAction(15, 0, "Create Light", "Lighting", "Create Light {0} at (x: {1},y: {2}, z: {3}) color: {4}, {5}, {6}, {7}", "Create Light.", "CreateLight");

AddNumberParam("object_index", "Which slot has the object reference", "0");
AddNumberParam("floor_y", "Y coordinate that represents the floor", "0");
AddAction(16, 0, "Buid Node's Y walls", "Wall Detection", "Get Node {0} Wall Info (floor at y:{1})", "Buid Node's Y walls", "GetWallsInfo");


AddStringParam("message", "", "\"\"");
AddAction(17, 0, "Log", "Log", "Log {0}", "Log.","Log");

AddNumberParam("global_offset_x", "X Offset used when setting the position of nodes, this will be use to convert Construct2's coordiantes to Copperlicht's", "0");
AddNumberParam("global_offset_z", "Z Offset used when setting the position of nodes, this will be use to convert Construct2's coordiantes to Copperlicht's", "0");
AddAction(18, 0, "Set Global Offset", "Global", "Set Global Offset to x: {0}, z: {1}", "Set Global Offset.", "SetOffset");


AddNumberParam("object_index", "Which slot has the object reference", "0");
AddNumberParam("mesh_buffer_idx", "Mesh buffer to add to (affected buffer)", "0");
AddNumberParam("other_node_idx", "Node containing the mesh buffer to add", "1");
AddNumberParam("mesh_buffer_to_add_idx", "Index of the mesh buffer to add", "0");
AddAction(19, 0, "Add To Mesh Buffers", "Scene Nodes", "Add To Node {2}'s Mesh Buffer {3} to Node {0}'s Mesh Buffer {1}", "Add To Mesh Buffers.", "AddToMeshBuffers");

AddAction(20, 0, "calculate camera ray collision", "Scene Nodes", "calculates collision of ray from the camera",
"calculate camera ray collision.", "calculate_camera_ray_collision");

AddNumberParam("object_index", "Which slot has the object reference", "0");
AddNumberParam("x", "Raw 3d coordinate", "0");
AddNumberParam("y", "Raw 3d coordinate", "0");
AddNumberParam("z", "Raw 3d coordinate", "0");
AddAction(21, 0, "Set Node Raw Position", "Transform", "Set Node {0} Raw Position to ({1}, {2}, {3})", "Set Node Raw Position", "SetNodeRawPosition");


AddNumberParam("other_node_start_idx", "Starting index to check against", "0");
AddNumberParam("other_node_end_idx", "End index to check against", "0");
AddAction(22, 0, "Perform collision nodes with camera ray", "Collisions", "Check Collision Camera Ray with Nodes from {0} to {1}", "Perform collision nodes with camera ray.", "perform_collision_nodes_with_camera_ray");

AddNumberParam("object_index", "Which slot has the object reference", "0");
AddNumberParam("ellipsoid_size_x", "X size of the player ellipsoid (in raw 3d coordiantes)", "20");
AddNumberParam("ellipsoid_size_y", "Y size of the player ellipsoid (in raw 3d coordiantes)", "40");
AddNumberParam("ellipsoid_size_z", "Z size of the player ellipsoid (in raw 3d coordiantes)", "20");
AddNumberParam("gravity_direction_x", "Gravity direction X (in raw 3d coordiantes)", "0");
AddNumberParam("gravity_direction_y", "Gravity direction Y (in raw 3d coordiantes)", "-10");
AddNumberParam("gravity_direction_z", "Gravity direction Z (in raw 3d coordiantes)", "0");
AddNumberParam("eye_position_x", "X position of the eye in the ellipsoid (raw position relative to the ellipsoid)", "0");
AddNumberParam("eye_position_y", "X position of the eye in the ellipsoid (raw position relative to the ellipsoid)", "30");
AddNumberParam("eye_position_z", "X position of the eye in the ellipsoid (raw position relative to the ellipsoid)", "0");
AddAction(23, 0, "Add Collision Responder", "Collisions", "Add Collision Responder to Node {0}, ellipsoid size ({1}, {2}, {3})", "Add Collision Responder", "AddCollisionResponderToNode");

AddNumberParam("owner_node_idx", "Which slot has the node to own the detector", "0");
AddNumberParam("node_idx_to_detect", "Which slot has the node to detect", "0");
AddNumberParam("radius", "Radius of detection", "0");
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Trigger On Leave?", "");
AddAction(24, 0, "Add Proximity Detector To Node", "Collisions", "Detect {1} when in proximity To {0} at radius {2} (On Leave {3})", "Add Proximity Detector To Node", "AddProximityDetectorToNode");


AddNumberParam("owner_node_idx", "Which slot has the node to own the detector", "0");
AddNumberParam("raw_start_x", "X Start (Raw coordinate)", "0");
AddNumberParam("raw_start_y", "Y Start (Raw coordinate)", "0");
AddNumberParam("raw_start_z", "Z Start (Raw coordinate)", "0");
AddNumberParam("raw_end_x", "X End (Raw coordinate)", "0");
AddNumberParam("raw_end_y", "Y End (Raw coordinate)", "0");
AddNumberParam("raw_end_z", "Z End (Raw coordinate)", "0");
AddNumberParam("time_for_way", "Time for moving along the whole line in milliseconds", "3000");
AddNumberParam("time_for_way", "Time for moving along the whole line in milliseconds", "0");
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Loop?", "");
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Delete after end reached?", "");
AddAction(25, 0, "Add Fly Straight Animator To Node", "Movement", "Add Fly Straight to {0} (Loop )", "Add Fly Straight Animator To Node", "AddFlyStraightAnimatorToNode");


//////////////////////////////////////////////////////////////
// Expressions
//AddNumberParam("X", "The X index (0-based) of the array value to get.", "0");
//AddExpression(0, ef_return_any | ef_variadic_parameters, "Get value at", "Array", "At", "Get value from the array.  Add second or third parameters to specify Y and Z indices.");

AddExpression(0, ef_return_number, "Get Number of 3d nodes Managed.", "copperlicht3d", "NumberOfObjsManged", "Get Number of 3d nodes Managed.");
AddExpression(1, ef_return_number, "Get Available 3D node slot.", "copperlicht3d", "AvailableSlot", "Get Available 3D node slot.");

AddExpression(2, ef_return_number, "Get Number of walls in walls info.", "copperlicht3d", "get_number_walls", "Get Number of walls in walls info.");

AddNumberParam("wall_idx", "Wall Index", "0");
AddExpression(3, ef_return_number, "Get wall x position.", "copperlicht3d", "get_wall_x", "Get wall x position.");

AddNumberParam("wall_idx", "Wall Index", "0");
AddExpression(4, ef_return_number, "Get wall y position.", "copperlicht3d", "get_wall_y", "Get wall y position.");

AddNumberParam("wall_idx", "Wall Index", "0");
AddExpression(5, ef_return_number, "Get wall height.", "copperlicht3d", "get_wall_width", "Get wall height.");

AddNumberParam("wall_idx", "Wall Index", "0");
AddExpression(6, ef_return_number, "Get wall width.", "copperlicht3d", "get_wall_height", "Get wall width.");

AddNumberParam("object_index", "Node Index", "0");
AddExpression(7, ef_return_number, "Get Node Position X.", "copperlicht3d", "GetNodePositionX", "Get Node Position X.");
AddNumberParam("object_index", "Node Index", "0");
AddExpression(8, ef_return_number, "Get Node Position Y.", "copperlicht3d", "GetNodePositionY", "Get Node Position Y.");
AddNumberParam("object_index", "Node Index", "0");
AddExpression(9, ef_return_number, "Get Node Position Z.", "copperlicht3d", "GetNodePositionZ", "Get Node Position Z.");


AddExpression(10, ef_return_number, "Get Ray Collision Position Raw X.", "collisions", "get_ray_collision_x", "Get Ray Collision Position X.");
AddExpression(11, ef_return_number, "Get Ray Collision Position Raw Y.", "collisions", "get_ray_collision_y", "Get Ray Collision Position Y.");
AddExpression(12, ef_return_number, "Get Ray Collision Position Raw Z.", "collisions", "get_ray_collision_z", "Get Ray Collision Position Z.");
AddExpression(13, ef_return_number, "Get Index of Last Node Collided.", "collisions", "last_node_idx_collided", "Get Index of Last Node Collided.");
AddExpression(14, ef_return_number, "Last Node Index in proximity.", "collisions", "get_last_node_idx_in_proximity", "Last Node Index in proximity.");
AddExpression(15, ef_return_number, "Last Node Index with proximity fired.", "collisions", "get_last_node_idx_proximity_fired", "Last Node Index with proximity fired.");


ACESDone();

// Property grid properties for this plugin
var property_list = [
//		new cr.Property(ept_integer,		"Width",		10,			"Initial number of elements on the X axis."),
//		new cr.Property(ept_integer,		"Height",		1,			"Initial number of elements on the Y axis."),
//		new cr.Property(ept_integer,		"Depth",		1,			"Initial number of elements on the Z axis."),
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	if (this.properties["Width"] < 1)
		this.properties["Width"] = 1;
		
	if (this.properties["Height"] < 1)
		this.properties["Height"] = 1;
		
	if (this.properties["Depth"] < 1)
		this.properties["Depth"] = 1;
}
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
}
