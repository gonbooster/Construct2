//document.write('<script type="text/javascript" src="copperlicht.js"></script>');
$(document).ready(function() {	

//Clear the borderwrap to allow transparency
	$('#borderwrap').css({'background-color' : 'rgba(255, 255, 255, 0)'});

/* Add the canvas that will show the Copperlicht3D viewport */
	var copper_area_canvas_txt = '<canvas id="3darea" width="636" height="480" style="background-color:#000000; z-index:-1;"></canvas>';
	document.getElementById('c2canvasdiv').innerHTML += copper_area_canvas_txt;
});


// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.copperlicht3d = function (runtime) {
    this.runtime = runtime;
};

(function () {
    var pluginProto = cr.plugins_.copperlicht3d.prototype;

    /////////////////////////////////////
    // Object type class
    pluginProto.Type = function (plugin) {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };

    var typeProto = pluginProto.Type.prototype;

    typeProto.onCreate = function () {
    };

    /////////////////////////////////////
    // Instance class
    pluginProto.Instance = function (type) {
        this.type = type;
        this.runtime = type.runtime;

        this.scene = null;
        this.engine = null;
        this.last_ray_collision = null;
        this.last_node_idx_collided = null;
        this.last_node_idx_in_proximity = -1; //the index of the last node detected in another node's proximity
        this.last_node_idx_proximity_fired = -1; //the index of the last node that detected another node in proximity
        this.managed_objs = [];
        this.offset_x = 0;
        this.offset_z = 0;
        this.positions_on_floor = [];
        this.scale = 1;
    };

    var instanceProto = pluginProto.Instance.prototype;

    instanceProto.onCreate = function () {
    };

    instanceProto.LoadScene = function (scene_path) {
        this.engine = startCopperLichtFromFile('3darea', scene_path);
        this_instance = this;
        // this is called when loading the 3d scene has finished
        this.engine.OnLoadingComplete = function () {
            this_instance.scene = this_instance.engine.getScene();
            if (this_instance.scene) {
                //put canvas behind c2 canvas
                var pos = $("#c2canvas").position();
                $("#3darea").css({
                    position: "absolute",
                    top: pos.top + "px",
                    left: (pos.left + 2) + "px"
                }).show();
                // force the 3d engine to update the scene every frame
                this_instance.scene.setRedrawMode(CL3D.Scene.REDRAW_EVERY_FRAME);
                //Tell C2 that the scene loaded
                this_instance.runtime.trigger(pluginProto.cnds.OnSceneLoaded, this_instance);

            }
        }
    };

    //Stores a 3D node into an array, so that we can operate on that node by using the index (faster than by looking up the object by name)
    instanceProto.AddManagedNode = function (index_to_assign, name_of_node) {
        this.managed_objs[index_to_assign] = this.scene.getSceneNodeFromName(name_of_node);
    };

    instanceProto.DestroyManagedNode = function (object_index) {
        var obj = this.managed_objs[object_index];
        if (obj) {
            obj.getParent().removeChild(obj);
            this.managed_objs[object_index] = null;
        }
    };

    instanceProto.ClearManagedNode = function (index_to_clear) {
        this.managed_objs[index_to_clear] = null;
    };

    // Sets the position of a 3D node
    // So that our C2 level (rotated 90 degress counter-clockwise) corresponds to our coppercube level,
    // you need to switch z with x when calling this method from constrcut
    instanceProto.SetNodePosition = function (object_index, x, y) {
        var obj = this.managed_objs[object_index];
        if (obj) {
            obj.Pos.X = this.offset_x + x * this.scale;
            obj.Pos.Z = this.offset_z + y * this.scale;
        }
    };
    // Sets the rotation of a 3D node
    instanceProto.SetNodeAngle = function (object_index, x_angle, y_angle, z_angle) {
        var obj = this.managed_objs[object_index];
        if (obj) {
            obj.Rot.X = x_angle;
            obj.Rot.Y = y_angle;
            obj.Rot.Z = z_angle;
        }
    };
    instanceProto.SetNodeScale = function (object_index, x, y, z) {
        var obj = this.managed_objs[object_index];
        if (obj) {
            obj.Scale.X = x;
            obj.Scale.Y = y;
            obj.Scale.Z = z;
        }
    };
    //Sets the visibility of the 3D Node
    instanceProto.SetManagedNodeVisibility = function (is_visible) {
        var obj = this.managed_objs[object_index];
        if (obj) {
            obj.Visible = (is_visible != "Invisible");
        }
    };

    var _temp_cam_target = new CL3D.Vect3d(0, 0, 0);
    //Sets the target of a camera Node
    instanceProto.SetCameraTarget = function (camera_node_name, x, y, z) {
        if (this.scene) {
            var cam = this.scene.getSceneNodeFromName(camera_node_name);
            if (cam) {
                _temp_cam_target.X = this.offset_x + x;
                _temp_cam_target.Y = y;
                _temp_cam_target.Z = this.offset_z + z;
                cam.setTarget(_temp_cam_target);

            }
        }
    };

    //Set the animation
    instanceProto.NodePlayAnimation = function (object_index_to_animate,
animation_name, loop_animation) {
        var obj = this.managed_objs[object_index_to_animate];
        if (obj) {
            obj.setAnimation(animation_name);
            obj.setLoopMode(loop_animation == 0);
        }
    };

    //Clone a managed object and put the new instance in the deisired slot
    instanceProto.CloneManagedNode = function (object_index_to_clone, new_object_index) {
        var obj = this.managed_objs[object_index_to_clone];
        if (obj) {
            this.managed_objs[new_object_index] = obj.createClone(obj.getParent());
        }
    };


    // Sets the Y position of a 3D node
    instanceProto.SetNodePositionY = function (object_index, y) {
        var obj = this.managed_objs[object_index];
        if (obj) {
            obj.Pos.Y = y * this.scale;
        }
    };

    instanceProto.GetNodePositionY = function (object_index) {
        var obj = this.managed_objs[object_index];
        if (obj) {
            return obj.Pos.Y / this.scale;
        }
        else
            return 0;
    };
    instanceProto.GetNodePositionX = function (object_index) {
        var obj = this.managed_objs[object_index];
        if (obj) {
            return (obj.Pos.X - this.offset_x) / this.scale;
        }
        else
            return 0;
    };
    instanceProto.GetNodePositionZ = function (object_index) {
        var obj = this.managed_objs[object_index];
        if (obj) {
            return (obj.Pos.Z - this.offset_z) / this.scale;
        }
        else
            return 0;
    };

    instanceProto.CreateCube = function (new_object_index, x, y, z, texture_path) {

        var cubenode = new CL3D.CubeSceneNode();
        this.scene.getRootSceneNode().addChild(cubenode);
        cubenode.Pos.X = this.offset_x + x * this.scale;
        cubenode.Pos.Y = y * this.scale;
        cubenode.Pos.Z = this.offset_z + z * this.scale;
        cubenode.getMaterial(0).Tex1 =
            this.engine.getTextureManager().getTexture(texture_path, true);
        this.managed_objs[new_object_index] = cubenode;
    };
    instanceProto.SetScale = function (new_scale) {
        this.scale = new_scale;
    };
    instanceProto.SetOffset = function (new_offset_x, new_offset_z) {
        this.offset_x = new_offset_x;
        this.offset_z = new_offset_z;
    };

    //Set lighting on node's material
    instanceProto.SetMaterialLighting = function (object_index, material_idx, new_light_mode) {
        var obj = this.managed_objs[object_index];
        if (obj) {
            var mat = obj.getMaterial(material_idx);
            mat.Lighting = (new_light_mode == 1);
        }
    };

    //create a light
    instanceProto.CreateLight = function (object_index, attenuation,
radius, x, y, z, alpha, blue, green, red) {
        var lightnode = new CL3D.LightSceneNode();
        lightnode.Pos.X = x;
        lightnode.Pos.Y = y;
        lightnode.Pos.Z = z;
        lightnode.LightData.Attenuation = attenuation;
        lightnode.LightData.Radius = radius;
        lightnode.LightData.Color.A = alpha;
        lightnode.LightData.Color.B = blue;
        lightnode.LightData.Color.G = green;
        lightnode.LightData.Color.R = red;
        this.scene.getRootSceneNode().addChild(lightnode);
        this.managed_objs[object_index] = lightnode;
    };

    instanceProto.GetWallsInfo = function (node_idx, floor_y) {
        var node = this.managed_objs[node_idx];
        if (node) {
            this.positions_on_floor = [];
            positions_on_floor = this.positions_on_floor; // e.g.: [ [ [0,1], [1,1] ], [ [3,1], [4,1] ] ] each element represents the pair of coordinates that make one wall.
            var buffers = node.getMesh().GetMeshBuffers();
            var floor_pos_y = floor_y;

            for (var buffer_idx = 0; buffer_idx < buffers.length; buffer_idx++) {
                var indices = buffers[buffer_idx].Indices;
                var vertices = buffers[buffer_idx].Vertices;
                for (var index_idx = 0; index_idx < indices.length; index_idx += 3) { //for each triangle
                    var temp_positions = [];
                    curr_vertex = 2;
                    while (curr_vertex >= 0) {
                        var vertex = vertices[indices[index_idx + curr_vertex]];
                        if (Math.floor(vertex.Pos.Y) == floor_pos_y) {
                            temp_positions.push([vertex.Pos.X, vertex.Pos.Z]);
                        }

                        curr_vertex--;
                    }
                    if (temp_positions.length == 2) //only 2 vertices touching floor, assuming walls are made of planes
                    {
                        //console.log(temp_positions);
                        positions_on_floor.push(temp_positions);
                    }
                }
            }
        }
    };
    // helper function for quickly creating a 3d vertex from 3d position and texture coodinates
    function clone_vertex(vertex_to_add, node_offset_x, node_offset_y, node_offset_z) {
        var vtx = new CL3D.Vertex3D(true);
        vtx.Pos.X = vertex_to_add.Pos.X + node_offset_x;
        vtx.Pos.Y = vertex_to_add.Pos.Y + node_offset_y;
        vtx.Pos.Z = vertex_to_add.Pos.Z + node_offset_z;
        vtx.TCoords.X = vertex_to_add.TCoords.X;
        vtx.TCoords.Y = vertex_to_add.TCoords.X;
        return vtx;
    }
    instanceProto.AddToMeshBuffers = function (node_idx, mesh_buffer_idx, other_node_idx, mesh_buffer_to_add_idx) {
        var node = this.managed_objs[node_idx];
        var other_node = this.managed_objs[other_node_idx];
        if (node && other_node) {
            //calculate offset positions
            var node_offset_x = other_node.Pos.X - node.Pos.X;
            var node_offset_y = other_node.Pos.Y - node.Pos.Y;
            var node_offset_z = other_node.Pos.Z - node.Pos.Z;

            var buffer_affected = node.getMesh().GetMeshBuffers()[mesh_buffer_idx];
            var mesh_buffer_to_add = other_node.getMesh().GetMeshBuffers()[mesh_buffer_to_add_idx];

            //get the vertices and indices array to be affected
            var indices = buffer_affected.Indices;
            var vertices = buffer_affected.Vertices;
            var indices_to_add = mesh_buffer_to_add.Indices;
            var vertices_to_add = mesh_buffer_to_add.Vertices;

            //when adding indices, we will offset them b/c there is already indices in hte original mesh
            var vertex_index_offset = vertices.length;

            for (var vertex_idx = 0; vertex_idx < vertices_to_add.length; vertex_idx++) { //for each vertex to add
                var vertex_to_add = vertices_to_add[vertex_idx];
                var new_vertex = clone_vertex(vertex_to_add, node_offset_x, node_offset_y, node_offset_z);
                vertices.push(new_vertex);
            }
            for (var index_idx = 0; index_idx < indices_to_add.length; index_idx++) { //for each index to add
                indices.push(indices_to_add[index_idx] + vertex_index_offset);
            }

            buffer_affected.update(false);
        }
    };

    instanceProto.get_number_walls = function () {
        return this.positions_on_floor.length;
    };

    instanceProto.get_wall_x = function (wall_idx) {
        return (this.positions_on_floor[wall_idx][1][1]) / this.scale; //second corrdinate's Z (due to the inverse way copperlicht threats x and z)
    };

    instanceProto.get_wall_y = function (wall_idx) {
        return (this.positions_on_floor[wall_idx][1][0]) / this.scale; //second corrdinate's X (due to the inverse way copperlicht threats x and z)
    };

    instanceProto.get_wall_width = function (wall_idx) {
        return Math.abs(this.positions_on_floor[wall_idx][0][1] - this.positions_on_floor[wall_idx][1][1]) / this.scale; //first corrdinate's X - second coordinate's X
    };

    instanceProto.get_wall_height = function (wall_idx) {
        return Math.abs(this.positions_on_floor[wall_idx][0][0] - this.positions_on_floor[wall_idx][1][0]) / this.scale; //first corrdinate's Z - second coordinate's Z
    };

    instanceProto.calculate_camera_ray_collision = function () {
        if (!this.scene)
            return;

        this.last_ray_collision = null;
        var cam = this.scene.getActiveCamera();

        // calculate the start and end 3d point of the line, the beinning being
        // the camera position and the end about 2000 units away in the direction of the
        // camera target

        var startLine = cam.getAbsolutePosition();
        var endLine = startLine.add(cam.getTarget().substract(startLine).multiplyWithScal(2000));

        // test our line for a collision with the world

        var collisionPoint = this.scene.getCollisionGeometry().getCollisionPointWithLine(startLine, endLine, true, null);

        if (collisionPoint) {
            // store the collision pos

            this.last_ray_collision = collisionPoint;
        }

    };
    instanceProto.check_collision_nodes = function (node1_idx, other_node_start_idx, other_node_end_idx) {
        var node1 = this.managed_objs[node1_idx];
        if (node1 != null) {
            var my_box = node1.getTransformedBoundingBox();
            for (var curr_node_idx = other_node_start_idx; curr_node_idx <= other_node_end_idx; curr_node_idx++) {
                var other_node = this.managed_objs[curr_node_idx];

                if (other_node != null) {
                    var other_box = other_node.getTransformedBoundingBox();
                    my_box.intersectsWithBox(other_box)
                    {
                        this.last_node_idx_collided = curr_node_idx;
                        //we can only collide with one node at the time
                        return true;
                    }
                }
            }
        }
        return false;

    };
    instanceProto.perform_collision_nodes_with_camera_ray = function (other_node_start_idx, other_node_end_idx) {
        this.last_node_idx_collided = -1;
        //first check collisions with static geometry
        this.calculate_camera_ray_collision();
        var static_collision_point = this.last_ray_collision;
        this.last_ray_collision = null;
        if (this.scene != null) {

            var cam = this.scene.getActiveCamera();

            // calculate the start and end 3d point of the line, the beinning being
            // the camera position and the end about 2000 units away in the direction of the
            // camera target

            var startLine = cam.getAbsolutePosition();
            var endLine = startLine.add(cam.getTarget().substract(startLine).multiplyWithScal(2000));

            var curr_node_collided = null;
            for (var curr_node_idx = other_node_start_idx; curr_node_idx <= other_node_end_idx; curr_node_idx++) {
                var other_node = this.managed_objs[curr_node_idx];

                if (other_node != null) {
                    var other_box = other_node.getTransformedBoundingBox();
                    if (other_box.intersectsWithLine(startLine, endLine)) //TODO: we need to find a way of determining whihc of the collided nodes is closer to the camera
                    {

                        //compare to distance of the static collision
                        if (static_collision_point == null || compare_distance(startLine, static_collision_point, other_node.Pos) < 0) {

                            //compare to distance of the current node collision
                            if (curr_node_collided == null || compare_distance(startLine, curr_node_collided.Pos, other_node.Pos) < 0) {
                                //TODO: compare distance with the last node collided, if less distance then make this node the collided node
                                this.last_node_idx_collided = curr_node_idx;
                                curr_node_collided = other_box;
                                //var other_selector = new CL3D.MeshTriangleSelector(other_node.Mesh, other_node);
                                //var collisionPoint = other_selector.getCollisionPointWithLine(startLine, endLine, true, null);
                                //if (collisionPoint) {
                                // store the collision pos
                                //this.last_ray_collision = collisionPoint;
                                //}
                            }
                        }
                        //we can only collide with one node at the time
                        //return true;
                    }
                }
            }
        }

    };

    //Returns positive number if pos_a is closer to reference_pos than pos_b
    function compare_distance(reference_pos, pos_a, pos_b) {
        pos_a = pos_a.clone();
        pos_b = pos_b.clone();
    //ignore y 
        pos_a.Y = pos_b.Y = reference_pos.Y;
        var dist_a = reference_pos.getDistanceFromSQ(pos_a);
        var dist_b = reference_pos.getDistanceFromSQ(pos_b);
        return dist_b - dist_a;
    }

    instanceProto.SetNodeRawPosition = function (object_index, x, y, z) {
        var obj = this.managed_objs[object_index];
        if (obj) {
            obj.Pos.X = x;
            obj.Pos.Y = y;
            obj.Pos.Z = z;
        }
    };

    //Adds a collision response to a managed node.
    instanceProto.AddCollisionResponderToNode = function (object_index, ellipsoid_size_x,
    ellipsoid_size_y,
    ellipsoid_size_z,
    gravity_direction_x,
    gravity_direction_y,
    gravity_direction_z,
    eye_position_x,
    eye_position_y,
    eye_position_z
     ) {
        var obj = this.managed_objs[object_index];
        if (obj) {
            var colanimator = new CL3D.AnimatorCollisionResponse(
          new CL3D.Vect3d(ellipsoid_size_x, ellipsoid_size_y, ellipsoid_size_z),   // size of the player ellipsoid
          new CL3D.Vect3d(gravity_direction_x, gravity_direction_y, gravity_direction_z),   // gravity direction
          new CL3D.Vect3d(eye_position_x, eye_position_y, eye_position_z),   // position of the eye in the ellipsoid
          this.scene.getCollisionGeometry());

            obj.addAnimator(colanimator);
        }
    };
    //////////////////////////////////////
    // Conditions
    pluginProto.cnds = {};
    var cnds = pluginProto.cnds;

    cnds.OnSceneLoaded = function () {
        return true;
    };
    cnds.collision_nodes_with_camera_ray_occurred = function () {
        return (this.last_node_idx_collided > -1);
    };
    cnds.collision_static_with_camera_ray_occurred = function () {
        return (this.last_ray_collision != null);
    };

    cnds.OnProximity = function () {
        return true;
    };
    


    //////////////////////////////////////
    // Actions
    pluginProto.acts = {};
    var acts = pluginProto.acts;

    acts.LoadScene = function (scene_path) {
        this.LoadScene(scene_path);
    };
    acts.calculate_camera_ray_collision = function () {
        this.calculate_camera_ray_collision();
    };
    acts.perform_collision_nodes_with_camera_ray = function (other_node_start_idx, other_node_end_idx) {
        this.perform_collision_nodes_with_camera_ray(other_node_start_idx, other_node_end_idx);
    };

    acts.AddManagedNode = function (index_to_assign, name_of_node) {
        this.AddManagedNode(index_to_assign, name_of_node);
    };

    acts.AddCollisionResponderToNode = function (object_index, ellipsoid_size_x,
    ellipsoid_size_y,
    ellipsoid_size_z,
    gravity_direction_x,
    gravity_direction_y,
    gravity_direction_z,
    eye_position_x,
    eye_position_y,
    eye_position_z
     ) {
        this.AddCollisionResponderToNode(object_index, ellipsoid_size_x, ellipsoid_size_y,
    ellipsoid_size_z,
    gravity_direction_x,
    gravity_direction_y,
    gravity_direction_z,
    eye_position_x,
    eye_position_y,
    eye_position_z);
    };
    acts.CloneManagedNode = function (object_index_to_clone, new_object_index) {
        this.CloneManagedNode(object_index_to_clone, new_object_index);
    };

    acts.SetNodeAngle = function (object_index, x_angle, y_angle, z_angle) {
        this.SetNodeAngle(object_index, x_angle, y_angle, z_angle);
    };

    acts.SetNodePosition = function (object_index, x, y) {
        this.SetNodePosition(object_index, x, y);
    };
    acts.SetNodeRawPosition = function (object_index, x, y, z) {
        this.SetNodeRawPosition(object_index, x, y, z);
    };
    acts.DestroyManagedNode = function (object_index) {
        this.DestroyManagedNode(object_index);
    };
    acts.ClearManagedNode = function (object_index) {
        this.ClearManagedNode(object_index);
    };
    acts.SetManagedNodeVisibility = function (is_visible) {
        this.SetManagedNodeVisibility(is_visible);
    };

    acts.SetCameraTarget = function (camera_node_name, x, y, z) {
        this.SetCameraTarget(camera_node_name, x, y, z);
    };

    acts.SetNodeScale = function (object_index, x, y, z) {
        this.SetNodeScale(object_index, x, y, z);
    };
    acts.NodePlayAnimation = function (object_index_to_animate,
animation_name, loop_animation) {
        this.NodePlayAnimation(object_index_to_animate, animation_name,
loop_animation);
    };

    acts.SetNodePositionY = function (object_index, y) {
        this.SetNodePositionY(object_index, y);
    };

    acts.CreateCube = function (new_object_index, x, y, z, texture_path) {
        this.CreateCube(new_object_index, x, y, z, texture_path);
    };

    acts.SetScale = function (new_scale) {
        this.SetScale(new_scale);
    };

    acts.SetOffset = function (new_offset_x, new_offset_z) {
        this.SetOffset(new_offset_x, new_offset_z);
    };

    acts.SetMaterialLighting = function (object_index, material_idx, new_light_mode) {
        this.SetMaterialLighting(object_index, material_idx, new_light_mode);
    };

    acts.CreateLight = function (object_index, x, y, z, alpha, blue, green, red, attenuation, radius) {
        this.CreateLight(object_index, attenuation, 1, x, y, z, alpha, blue,
green, red);
    };

    acts.Log = function (msg) {
        console.log(msg);
    };

    acts.GetWallsInfo = function (object_index, floor_y) {
        this.GetWallsInfo(object_index, floor_y);
    };

    acts.AddToMeshBuffers = function (node_idx, mesh_buffer_idx, other_node_idx, mesh_buffer_to_add_idx) {
        this.AddToMeshBuffers(node_idx, mesh_buffer_idx, other_node_idx, mesh_buffer_to_add_idx);
    };
	
	
    acts.AddProximityDetectorToNode = function (owner_node_idx, node_idx_to_detect, radius, trigger_on_leave) {
        var obj = this.managed_objs[owner_node_idx];
        var node_to_detect = this.managed_objs[node_idx_to_detect];
        
        if (obj) {
            //Tell C2 when the proximity is reached
            this_instance = this;
            var proximity_callback = function(){ 
                last_node_idx_proximity_fired = owner_node_idx;
                last_node_idx_in_proximity = node_idx_to_detect;
                this_instance.runtime.trigger(pluginProto.cnds.OnProximity, this_instance);
                //Reset the values for future detections
                last_node_idx_proximity_fired = -1;
                last_node_idx_in_proximity = -1;
             };
            var animator = new CL3D.AnimatorOnProximity(this.scene, radius,
                obj.Id, proximity_callback, (trigger_on_leave == 1));
            obj.addAnimator(animator);
        }
    };
    acts.AddFlyStraightAnimatorToNode = function (owner_node_idx,  raw_start_x, raw_start_y, raw_start_z,  raw_end_x, raw_end_y, raw_end_z, time_for_way, loop, delete_after_reached) {
        var obj = this.managed_objs[owner_node_idx];
        
        if (obj) {
            
            var animator = new CL3D.AnimatorFlyStraight(new CL3D.Vect3d(raw_start_x, raw_start_y, raw_start_z), new CL3D.Vect3d(raw_end_x, raw_end_y, raw_end_z),
                time_for_way, (loop == 1), (delete_after_reached == 1));
            obj.addAnimator(animator);
        }
    };
    //////////////////////////////////////
    // Expressions

    //TODO ADD EXPRESSIONS TO GET A NODE'S X,Y,Z POSITION
    pluginProto.exps = {};
    var exps = pluginProto.exps;


    exps.GetNodePositionY = function (ret, object_index) {
        ret.set_float(this.GetNodePositionY(object_index));
    };
    exps.GetNodePositionX = function (ret, object_index) {
        ret.set_float(this.GetNodePositionX(object_index));
    };
    exps.GetNodePositionZ = function (ret, object_index) {
        ret.set_float(this.GetNodePositionZ(object_index));
    };

    exps.get_number_walls = function (ret) {
        ret.set_int(this.get_number_walls());
    };

    exps.get_ray_collision_x = function (ret) {
        var ret_val = 0;
        if (this.last_ray_collision != null)
            ret_val = this.last_ray_collision.X;
        ret.set_float(ret_val);
    };
    exps.get_ray_collision_y = function (ret) {
        var ret_val = 0;
        if (this.last_ray_collision != null)
            ret_val = this.last_ray_collision.Y;
        ret.set_float(ret_val);
    };
    exps.get_ray_collision_z = function (ret) {
        var ret_val = 0;
        if (this.last_ray_collision != null)
            ret_val = this.last_ray_collision.Z;
        ret.set_float(ret_val);
    };
    exps.last_node_idx_collided = function (ret) {
        ret.set_int(this.last_node_idx_collided);
    };

    exps.get_wall_x = function (ret, wall_idx) {
        ret.set_int(this.get_wall_x(wall_idx));
    };
    exps.get_wall_y = function (ret, wall_idx) {
        ret.set_int(this.get_wall_y(wall_idx));
    };
    exps.get_wall_width = function (ret, wall_idx) {
        ret.set_int(this.get_wall_width(wall_idx));
    };
    exps.get_wall_height = function (ret, wall_idx) {
        ret.set_int(this.get_wall_height(wall_idx));
    };
    exps.NumberOfObjsManged = function (ret) {
        ret.set_int(this.managed_objs.length);
    };
    exps.AvailableSlot = function (ret) {
        var available_idx = this.managed_objs.length;
        for (var obj_idx = 0; obj_idx < this.managed_objs.length; obj_idx++) {
            if (this.managed_objs[obj_idx] == null) {
                available_idx = obj_idx;
                break;
            }
        }
        //console.log("slot " + available_idx);
        ret.set_int(available_idx);
    };
    exps.get_last_node_idx_in_proximity = function (ret) {
        ret.set_int(this.last_node_idx_in_proximity);
    };
    exps.get_last_node_idx_proximity_fired = function (ret) {
        ret.set_int(this.last_node_idx_proximity_fired);
    };



}());