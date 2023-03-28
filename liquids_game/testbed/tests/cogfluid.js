function cogfluid() {

  camera.position.y = 2;
  camera.position.z = 3;
  var bodyDef0 = new b2BodyDef();
  // bodyDef0.filter.groupIndex = 0;
  var bodyDef1 = new b2BodyDef();
  // bodyDef0.filter.groupIndex = 1;
  var ground = world.CreateBody(bodyDef0);
  var ground1 = world.CreateBody(bodyDef1);

  // Obstacle geometry
  // var xbound_min = -1.5;
  // var xbound_max = 1.5;
  // var ybound_min = 0.0;
  // var ybound_max = 4.0;
  // // var fluid_x = 0.0;
  // var fluid_y = 3.45;
  // var fluid_radius = 0.4
  // var fluid_x = RandomFloat(xbound_min + fluid_radius * 1.01, 
  //   xbound_max - fluid_radius * 1.01)
  // // var cup_offset = 0.5;
  // var wall_thickness = 0.1;
  // var cup_inner_radius = 0.35;
  // var cup_height = 0.5;
  // this.cup_height = cup_height;
  // var cup_offset = RandomFloat(xbound_min + cup_inner_radius + wall_thickness,
  //   xbound_max - cup_inner_radius - wall_thickness)
  // var obs_radius = 0.25;
  // // var offset_x = 0.0;
  // var offset_x = RandomFloat(xbound_min + obs_radius, 
  //   xbound_max - obs_radius) 
  // // var offset_y = 1.5;
  // var offset_y = RandomFloat(ybound_min + obs_radius + cup_height, 
  //   ybound_max - obs_radius - fluid_radius * 1.05 - (ybound_max - fluid_y))

  // Boundary 
  var chainShape = new b2ChainShape();
  chainShape.vertices.push(new b2Vec2(xbound_min, ybound_min));
  chainShape.vertices.push(new b2Vec2(xbound_max, ybound_min));
  chainShape.vertices.push(new b2Vec2(xbound_max, ybound_max));
  chainShape.vertices.push(new b2Vec2(xbound_min, ybound_max));

  chainShape.CreateLoop();
  ground.CreateFixtureFromShape(chainShape, 0);

  // Fluid blob
  this.InitiateFluid();

  // Obstacle  
  var shape1 = new b2PolygonShape();
  var vertices = shape1.vertices;
  vertices.push(new b2Vec2(offset_x - obs_radius, offset_y - obs_radius));
  vertices.push(new b2Vec2(offset_x + obs_radius, offset_y - obs_radius));
  vertices.push(new b2Vec2(offset_x + obs_radius, offset_y + obs_radius));
  vertices.push(new b2Vec2(offset_x - obs_radius, offset_y + obs_radius));
  ground1.CreateFixtureFromShape(shape1, 0);

  // Obstacle mask
  this.MakeObstacleMask(vertices);

  // Left cup wall  
  var shape2 = new b2PolygonShape();
  var vertices = shape2.vertices;
  vertices.push(new b2Vec2(cup_offset - cup_inner_radius, 0));
  vertices.push(new b2Vec2(cup_offset - cup_inner_radius - wall_thickness, 0));
  vertices.push(new b2Vec2(cup_offset - cup_inner_radius - wall_thickness, cup_height));
  vertices.push(new b2Vec2(cup_offset - cup_inner_radius, cup_height));
  ground.CreateFixtureFromShape(shape2, 0);

  // Right cup wall
  var shape3 = new b2PolygonShape();
  var vertices = shape3.vertices;
  vertices.push(new b2Vec2(cup_offset + cup_inner_radius, 0));
  vertices.push(new b2Vec2(cup_offset + cup_inner_radius + wall_thickness, 0));
  vertices.push(new b2Vec2(cup_offset + cup_inner_radius + wall_thickness, cup_height));
  vertices.push(new b2Vec2(cup_offset + cup_inner_radius, cup_height));
  ground.CreateFixtureFromShape(shape3, 0);

  // Fill line 
  this.fill_line_thickness = 0.04;
  var fill_line_geometry = new THREE.PlaneGeometry(cup_inner_radius * 2, this.fill_line_thickness);
  var fill_line_material = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
  var fill_line = new THREE.Mesh(fill_line_geometry, fill_line_material);
  fill_line.position.x = cup_offset;
  fill_line.position.y = window.fill_line_height //RandomFloat(0, cup_height * 0.75);
  window.fill_line = fill_line;
  scene.add(window.fill_line);
  // scene.add(window.planes[1]);
  // scene.add(window.planes);
  
}

cogfluid.prototype.Keyboard = function(key) {
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
  if (!window.initiated) {
    switch (key) {
      case 'e':
        if (window.fill_line.position.y < window.cup_height - this.fill_line_thickness) {
          window.fill_line.position.y += 0.04;
        } else{};
        break;
      case 'd':
      if (window.fill_line.position.y > this.fill_line_thickness) {
          window.fill_line.position.y -= 0.04;
        } else{};
        break;
    };
  };
};

cogfluid.prototype.MakeObstacleMask = function(vertices) {
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

cogfluid.prototype.InitiateFluid = function() {
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