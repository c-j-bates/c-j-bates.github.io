function cogfluid_interactive() {

  camera.position.y = 2;
  camera.position.z = 3;
  var bodyDef0 = new b2BodyDef();
  var bodyDef1 = new b2BodyDef();
  var ground = world.CreateBody(bodyDef0);
  this.obstacle = world.CreateBody(bodyDef1);

  // Obstacle geometry
  // generateSceneGeometry();
  // debugger;
  // window.angle = 0;
  // window.xbound_min = -1.5;
  // window.xbound_max = 1.5;
  // window.ybound_min = 0.0;
  // window.ybound_max = 4.0;
  // window.fluid_y = 3.45;
  // window.fluid_radius = 0.4;
  // window.fluid_x = RandomFloat(window.xbound_min + window.fluid_radius * 1.01, 
  //   window.xbound_max - window.fluid_radius * 1.01)
  // var wall_thickness = 0.1;
  // var cup_inner_radius = 0.35;
  // var cup_height = 0.5;
  // window.cup_height = cup_height;
  // var cup_offset = RandomFloat(window.xbound_min + cup_inner_radius + wall_thickness,
  //   window.xbound_max - cup_inner_radius - wall_thickness)
  // window.obs_radius = 0.25;
  // window.offset_x = RandomFloat(window.xbound_min + window.obs_radius, 
  //   window.xbound_max - window.obs_radius);
  // window.offset_y = RandomFloat(window.ybound_min + window.obs_radius + cup_height, 
  //   window.ybound_max - window.obs_radius - window.fluid_radius * 1.05 - (window.ybound_max - window.fluid_y)); 
  
  // Boundary 
  var chainShape = new b2ChainShape();
  chainShape.vertices.push(new b2Vec2(window.xbound_min, window.ybound_min));
  chainShape.vertices.push(new b2Vec2(window.xbound_max, window.ybound_min));
  chainShape.vertices.push(new b2Vec2(window.xbound_max, window.ybound_max));
  chainShape.vertices.push(new b2Vec2(window.xbound_min, window.ybound_max));

  chainShape.CreateLoop();
  ground.CreateFixtureFromShape(chainShape, 0);

  // Fluid blob
  this.InitiateFluid();

  // Obstacle  
  this.shape1 = new b2PolygonShape();
  this.vertices = this.shape1.vertices;
  this.obs_xmin = window.offset_x - window.obs_radius;
  this.obs_xmax = window.offset_x + window.obs_radius;
  this.obs_ymin = window.offset_y - window.obs_radius;
  this.obs_ymax = window.offset_y + window.obs_radius;
  this.vertices.push(new b2Vec2(this.obs_xmin, this.obs_ymin));
  this.vertices.push(new b2Vec2(this.obs_xmax, this.obs_ymin));
  this.vertices.push(new b2Vec2(this.obs_xmax, this.obs_ymax));
  this.vertices.push(new b2Vec2(this.obs_xmin, this.obs_ymax));
  this.obstacle.CreateFixtureFromShape(this.shape1, 0);

  // Obstacle mask
  this.MakeObstacleMask(this.vertices);  

  // Left cup wall  
  var shape2 = new b2PolygonShape();
  var vertices = shape2.vertices;
  vertices.push(new b2Vec2(window.cup_offset - window.cup_inner_radius, 0));
  vertices.push(new b2Vec2(window.cup_offset - window.cup_inner_radius - window.wall_thickness, 0));
  vertices.push(new b2Vec2(window.cup_offset - window.cup_inner_radius - window.wall_thickness, window.cup_height));
  vertices.push(new b2Vec2(window.cup_offset - window.cup_inner_radius, window.cup_height));
  ground.CreateFixtureFromShape(shape2, 0);

  // Right cup wall
  var shape3 = new b2PolygonShape();
  var vertices = shape3.vertices;
  vertices.push(new b2Vec2(window.cup_offset + window.cup_inner_radius, 0));
  vertices.push(new b2Vec2(window.cup_offset + window.cup_inner_radius + window.wall_thickness, 0));
  vertices.push(new b2Vec2(window.cup_offset + window.cup_inner_radius + window.wall_thickness, window.cup_height));
  vertices.push(new b2Vec2(window.cup_offset + window.cup_inner_radius, window.cup_height));
  ground.CreateFixtureFromShape(shape3, 0);

  // Fill line 
  this.fill_line_thickness = 0.04;
  var fill_line_geometry = new THREE.PlaneGeometry(window.cup_inner_radius * 2, this.fill_line_thickness);
  var fill_line_material = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
  var fill_line = new THREE.Mesh(fill_line_geometry, fill_line_material);
  fill_line.position.x = cup_offset;
  fill_line.position.y = window.fill_line_height //RandomFloat(0, cup_height * 0.75);
  window.fill_line = fill_line;
  scene.add(window.fill_line);
  // scene.add(window.planes[1]);
  // scene.add(window.planes);
}

// function toggleViscosity() {
//   if (window.initiated === false) {
//     var elem = document.getElementById("viscosityButton");
//     if (window.particleFlags === b2_waterParticle) {
//       window.particleFlags = b2_viscousParticle;
//       elem.value = 'High viscosity';
//     }
//     else {
//       window.particleFlags = b2_waterParticle;
//       elem.value = 'Low viscosity';
//     }
//   }
// }

cogfluid_interactive.prototype.Keyboard = function(key) {
  // switch (key) {
  //   case 38: // Up Arrow
  //     if (this.planes[0].position.y < this.cup_height - this.fill_line_thickness) {
  //       this.planes[0].position.y += 0.04;
  //     } else{};
  //     break;
  //   case 40: // Down Arrow
  //   if (this.planes[0].position.y > this.fill_line_thickness) {
  //       this.planes[0].position.y -= 0.04;
  //     } else{};
  //     break;
  // }
  switch (key) {
    // case 'e': 
    //   if (window.planes[0].position.y < this.cup_height - this.fill_line_thickness) {
    //     window.planes[0].position.y += 0.04;
    //   } else{};
    //   break;
    // case 'd': 
    // if (window.planes[0].position.y > this.fill_line_thickness) {
    //     window.planes[0].position.y -= 0.04;
    //   } else{};
    //   break;
    case 'r':
      this.RotateObstacle();

      break;
  }
}

cogfluid_interactive.prototype.RotateObstacle = function() {
  window.angle += 10 * Math.PI / 180; 
  this.DisableObstacle();
  this.EnableObstacle();
};

// class_name.prototype.method_name = function(first_argument) {
//   // body...
// };

cogfluid_interactive.prototype.MoveObstacle = function(p) {
  this.p = p;
  this.DisableObstacle();
  this.EnableObstacle();
};

cogfluid_interactive.prototype.InContainer = function(p) {
  return p.x >= window.xbound_min && p.x <= window.xbound_max &&
    p.y >= window.ybound_min && p.y <= window.ybound_max;
};

cogfluid_interactive.prototype.InObstacle = function(p) {
  return p.x >= this.obs_xmin && p.x <= this.obs_xmax &&
    p.y >= this.obs_ymin && p.y <= this.obs_ymax;
};

cogfluid_interactive.prototype.MouseUp = function(p) {
  // If the pointer is in the obstacle.
  if (this.InContainer(p)) {   
    // Move the obstacle to the touch position.
    this.MoveObstacle(p);
  }
};

cogfluid_interactive.prototype.MouseDown = function(p) {
  // If the pointer is in the obstacle.
  if (this.InObstacle(p)) {
    // Move the obstacle to the touch position.
    this.MoveObstacle(p);
  }
};

cogfluid_interactive.prototype.DisableObstacle = function() {
  if (this.obstacle) {
    world.DestroyBody(this.obstacle);
    this.obstacle = null;
    scene.remove(window.obs_mask);
  }
};

cogfluid_interactive.prototype.EnableObstacle = function() {
  if (this.obstacle === null) {
    var bodyDef = new b2BodyDef();
    this.obstacle = world.CreateBody(bodyDef);

    shape1 = new b2PolygonShape();
    this.vertices = shape1.vertices;
    if (this.p !== undefined && this.p.x !== undefined) {      
      window.offset_x = this.p.x;
      window.offset_y = this.p.y;
    }
    this.obs_xmin = window.offset_x - window.obs_radius;
    this.obs_xmax = window.offset_x + window.obs_radius;
    this.obs_ymin = window.offset_y - window.obs_radius;
    this.obs_ymax = window.offset_y + window.obs_radius;
    var verts0 = [];
    verts0.push([this.obs_xmin, this.obs_ymin]);       
    verts0.push([this.obs_xmax, this.obs_ymin]);
    verts0.push([this.obs_xmax, this.obs_ymax]);
    verts0.push([this.obs_xmin, this.obs_ymax]);
    this.RotateVertices(window.angle, verts0);
    
    this.obstacle.CreateFixtureFromShape(shape1, 0);
    // this.MakeObstacleMask();
  }
};

cogfluid_interactive.prototype.RotateVertices = function(angle, verts0) {  
  var verts = [];
  // Rotation matrix
  r = [[Math.cos(angle), -Math.sin(angle)],
       [Math.sin(angle), Math.cos(angle)]];

  for (i = 0; i < verts0.length; i++) {
    x = r[0][0] * (verts0[i][0] - window.offset_x) + r[0][1] * (verts0[i][1] - window.offset_y) + window.offset_x;
    y = r[1][0] * (verts0[i][0] - window.offset_x) + r[1][1] * (verts0[i][1] - window.offset_y) + window.offset_y;
    this.vertices.push(new b2Vec2(x, y));
  }
  this.MakeObstacleMask(this.vertices);
};

cogfluid_interactive.prototype.MakeObstacleMask = function(vertices) {
  var rectShape = new THREE.Shape();
  rectShape.moveTo(vertices[0].x, vertices[0].y);
  rectShape.lineTo(vertices[1].x, vertices[1].y);
  rectShape.lineTo(vertices[2].x, vertices[2].y);
  rectShape.lineTo(vertices[3].x, vertices[3].y);
  rectShape.lineTo(vertices[0].x, vertices[0].y);
  var rectGeom = new THREE.ShapeGeometry(rectShape);
  window.obs_mask = new THREE.Mesh(rectGeom, new THREE.MeshBasicMaterial({color: 0x696969}));   
  scene.add(window.obs_mask);
}

function DestroyFluid() {
  while (world.particleSystems.length > 0) {
      world.DestroyParticleSystem(world.particleSystems[0]);
  }
}

cogfluid_interactive.prototype.InitiateFluid = function() {
  if (window.particleFlags === undefined) {
    window.particleFlags = b2_waterParticle;
    }
  window.psd = new b2ParticleSystemDef();
  window.psd.radius = window.particle_radius//0.0108;//0.025;
  window.psd.dampingStrength = window.dampingStrength; //0.2;
  var particleSystem = world.CreateParticleSystem(window.psd);
  var circle = new b2CircleShape();
  circle.position.Set(window.fluid_x, window.fluid_y);
  circle.radius = window.fluid_radius;
  window.pgd = new b2ParticleGroupDef();
  window.pgd.shape = circle;
  window.pgd.color.Set(0, 0, 255, 255);
  window.pgd.flags = window.particleFlags;
  window.fluid = particleSystem.CreateParticleGroup(window.pgd);
}

function generateSceneGeometry() {
  // debugger;
  window.angle = 0;
  window.xbound_min = -1.5;
  window.xbound_max = 1.5;
  window.ybound_min = 0.0;
  window.ybound_max = 4.0;
  window.fluid_y = 3.45;
  window.fluid_radius = 0.4;
  window.fluid_x = RandomFloat(window.xbound_min + window.fluid_radius * 1.01, 
    window.xbound_max - window.fluid_radius * 1.01)
  window.wall_thickness = 0.1;
  window.cup_inner_radius = 0.35;
  window.cup_height = 0.5;
  window.cup_height = cup_height;
  window.cup_offset = RandomFloat(window.xbound_min + window.cup_inner_radius + 
    window.wall_thickness, window.xbound_max - window.cup_inner_radius - 
    window.wall_thickness)
  window.obs_radius = 0.25;  
  window.offset_x = window.xbound_min + window.obs_radius * 2;
  window.offset_y = window.ybound_max - window.obs_radius * 2 - window.fluid_radius * 3;
  if (window.scene_type === "cogfluid_interactive") {
    window.fill_line_height = RandomFloat(0, cup_height * 0.75);
  }
  else if (window.scene_type === "cogfluid") {
    window.fill_line_height = cup_height * 0.75;
    window.offset_x = RandomFloat(window.xbound_min + window.obs_radius, 
      window.xbound_max - window.obs_radius);
    window.offset_y = RandomFloat(window.ybound_min + window.obs_radius + window.cup_height, 
      window.ybound_max - window.obs_radius - window.fluid_radius * 1.05 - 
      (window.ybound_max - window.fluid_y));
    }
}
