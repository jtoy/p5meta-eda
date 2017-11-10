function Shape(){
  
  
}
var current_pallet_shape //shape we grabbed from pallet bar
var loaded_shape_index  //index from shapes of last added item
var current_moving_shape //shape we are moving around with mouse that comes from shapes array
var current_moving_shape_index //index of shape we are moving around with mouse that comes from shapes array
var current_moving_point //what are we changing, location, widht,height,etc
var shapes=[] //all shapes we added to drawCanvas

function drawScreens(){
  
  fill(255,0,0)
  rect(0,0,400,800)
  fill(0)
  ellipse(200,100,50,50)
  rectMode(CENTER)
  rect(200,200,50,50)
  triangle(170,340,230,340,200,280)
  
  stroke(0)
  strokeWeight(10)
  line(150,400,250,400)
  
  stroke(0)
  strokeWeight(1)
  quad(170,480,230,480,250,520,190,520)


  //canvas
  noStroke()
  rectMode(CORNER)
  fill(255,255,255)
  rect(400,00,400,800)
  stroke(0)
  line(600,0,600,height)
  line(400,height/2,800,height/2)
  
  
  //code list
  fill(200,200,0)
  rect(1000,0,200,800)

  noStroke()
  

}

function setup() {
  createCanvas(1600,800)
  drawScreens()
    //code
  fill(0,255,0)
  rect(800,0,400,800)
  //logs
  fill(0,255,255)
  rect(1200,0,400,800)
  
}
log_line = 20
function ml(m){
  fill(0)
  text(m,1200,log_line)
  log_line+=10
}

function coordinates_to_draw_canvas(mx,my){
  x= mx - 600
  y = my - 400
  return [x,y]
}

function draw_canvas_to_coordinates(mx,my){
  x = mx+600
  y = my+400
  return [x,y]
}

function closest_poi(mx,my,shape){  //given mouse coordinates and a shape, tell us which Point of Interest we are modifying, this changes per object
  if(shape.shape == "ellipse"){

    xy = coordinates_to_draw_canvas(mx,my)
    xyd = dist(shape.x,shape.y,xy[0],xy[1])
    
  

    ml("shapex"+shape.x)
    ml("mousex"+xy[0])
    ml("shapey"+shape.y)
    ml("mousey"+xy[1])
    ml("xyd:"+xyd)


    h_start_d = dist(shape.x,shape.y-shape.height/2,xy[0],xy[1])
    h_end_d = dist(shape.x,shape.y+shape.height/2,xy[0],xy[1])
    w_start_d = dist(shape.x-shape.width/2,shape.y,xy[0],xy[1])
    w_end_d = dist(shape.x+shape.width/2,shape.y,xy[0],xy[1])
    ml("h_start_d:"+h_start_d)
    ml("h_end_d:"+h_end_d)
    ml("w_start_d:"+w_start_d)
    ml("w_end_d:"+w_end_d)
    //refactor this shitty code
    
    if(xyd < h_start_d && xyd < h_end_d && xyd < h_end_d && xyd < w_end_d){
     poi = "xy" 
    }else if((h_start_d < xyd && h_start_d < w_start_d  && h_start_d < w_end_d) || (h_end_d < xyd && h_end_d < w_start_d  && h_end_d < w_end_d)){
      poi = "height"
    }else if((w_start_d < xyd && w_start_d < h_start_d  && w_start_d < h_end_d) || (w_end_d < xyd && w_end_d < h_start_d  && w_end_d < h_end_d)){
      poi = "width"
    }else{
      poi = "nopoi"
    }
    
    return poi
  }
}
function mousePressed(){
  ml('mouse_pressed')
  circledist = dist(200,100,mouseX,mouseY)
  ml(circledist)
  if(circledist <50){
    current_pallet_shape = "ellipse"
  }else if(mouseX > 1000 && mouseX < 1200){
    ml("in list")
    for(i=0;i<shapes.length;i++){
      lx = (i*20)+10
      listy= (i*40)
      s= shapes[i]
      if(mouseY>listy && mouseY < listy+40 ){
        ml("clicked in")
        loaded_shape_index = i
        break
      }
    }
      
  }else if(mouseX > 400 && mouseX < 800){ //inside drawCanvas
      for(i=0;i<shapes.length;i++){
        s = shapes[i]
        xy =draw_canvas_to_coordinates(s.x,s.y)
        d = dist(s.x,s.y,mouseX,mouseY)
      }
      goal= {x:mouseX,y:mouseY}
      var closest = shapes.reduce(function (prev, curr) {
        return (dist.apply(this,(draw_canvas_to_coordinates(curr.x,curr.y).concat([goal.x,goal.y]))) < dist.apply(this,(draw_canvas_to_coordinates(prev.x,prev.y).concat([goal.x,goal.y]))) ? curr : prev);
        //return (dist(curr.x,curr.y, goal.x,goal.y) < dist(prev.x,prev.y,goal.x,goal.y) ? curr : prev);
      });
      if(closest != null){
        xy = draw_canvas_to_coordinates(closest.x,closest.y)
        d = dist(xy[0],xy[1],mouseX,mouseY)
        ml('asdsds')
        if(d < closest.width/2){
          
          current_moving_shape = closest
          current_moving_point = closest_poi(mouseX,mouseY,closest)
          ml(current_moving_point)
        }
      }

    }
}
function is_mouse_in_draw_canvas(mx,my){
  
}


function mouseReleased(){
  if(current_pallet_shape != null){
    ml('released')
    ml(current_pallet_shape)
    current_pallet_shape = null
    
    if(mouseX > 400 && mouseX < 800){ //inside drawCanvas
      ml('in canvas')
      xy = coordinates_to_draw_canvas(mouseX,mouseY)
      shape = {shape:"ellipse",x:xy[0],y:xy[1],cr:0,cg:0,cb:0,width:50,height:50} 
      shapes.push(shape)
      loaded_shape_index = shapes.length-1
      renderUpdateShapeView()
      ml(JSON.stringify(shape))
    }
  }else if(current_moving_shape != null){
    if(mouseX > 400 && mouseX < 800){ //inside drawCanvas
      ml('in canvas mouse released')
      xy = coordinates_to_draw_canvas(mouseX,mouseY)
      
      if(current_moving_point == "xy"){
        current_moving_shape.x = xy[0]
        current_moving_shape.y = xy[1]
      }else if(current_moving_point == "height"){
        shapexy = draw_canvas_to_coordinates(current_moving_shape.x,current_moving_shape.y)
        length = (abs(shapexy[1] -mouseY))*2
        current_moving_shape.height = length
      }else if(current_moving_point == "width"){
        shapexy = draw_canvas_to_coordinates(current_moving_shape.x,current_moving_shape.y)
        length = (abs(shapexy[1] -mouseX))*2
        current_moving_shape.width = length
      }
      
      i = shapes.indexOf(current_moving_shape)
      shapes[i] = current_moving_shape
      loaded_shape_index = i
      current_moving_shape = null
      renderUpdateShapeView()

      
      
      
    }
  }
  renderUpdateShapeView()
}

function updateShape(){
  shape = shapes[loaded_shape_index]

  shape[this.attribute('name')] = parseInt(this.value())
  ml("Changing  "+loaded_shape_index +" to "+ shape[this.attribute('name')])
  shapes[loaded_shape_index] = shape
  ml(JSON.stringify(shapes))

}
function renderUpdateShapeView(){
  if(loaded_shape_index != null){ //this block i super slow, why?
    shape = shapes[loaded_shape_index]
    
    text_width = createElement('div', 'width');
    text_width.position(160, 600);
    input_width = createInput();
    input_width.position(200,600)
    input_width.value(shape.width)
    input_width.changed(updateShape)
    input_width.attribute('name','width')
    
    text_height = createElement('div', 'height');
    text_height.position(160, 615);
    input_height = createInput();
    input_height.position(200,615)
    input_height.value(shape.height)
    input_height.changed(updateShape)
    input_height.attribute('name','height')

    text_x = createElement('div', 'X');
    text_x.position(185, 630);
    input_x = createInput();
    input_x.attribute('name','x')
    input_x.position(200,630)
    input_x.value(shape.x)
    input_x.changed(updateShape)
    
    text_y = createElement('div', 'Y');
    text_y.position(185, 645);
    input_y = createInput();
    input_y.attribute('name','y')
    input_y.position(200,645)
    input_y.value(shape.y)
    input_y.changed(updateShape)
    
    text_cr = createElement('div', 'Rgb color');
    text_cr.position(130, 550);
    input_cr = createInput();
    input_cr.attribute('name','cr')
    input_cr.position(200,550)
    input_cr.value(shape.cr)
    input_cr.changed(updateShape)
    
    text_cg = createElement('div', 'rGb color');
    text_cg.position(130, 565);
    input_cg = createInput();
    input_cg.attribute('name','cg')
    input_cg.position(200,565)
    input_cg.value(shape.cg)
    input_cg.changed(updateShape)
    
    text_cb = createElement('div', 'rgB color');
    text_cb.position(130, 580);
    input_cb = createInput();
    input_cb.attribute('name','cb')
    input_cb.position(200,580)
    input_cb.value(shape.cb)
    input_cb.changed(updateShape)
    
  }
  
}

function draw() {
  drawScreens()
  
  if(mouseIsPressed){
    if(current_pallet_shape != null){
      fill(0)
      ellipse(mouseX,mouseY,50,50)
    }else if(current_moving_shape != null){
      fill(current_moving_shape.cr,current_moving_shape.cg,current_moving_shape.cb)
      if(current_moving_point == "xy"){
        ellipse(mouseX,mouseY,current_moving_shape.width,current_moving_shape.height)
      }else if(current_moving_point == "height"){
        xy = draw_canvas_to_coordinates(current_moving_shape.x,current_moving_shape.y)
        length = (abs(xy[1] -mouseY))*2
        ellipse(xy[0],xy[1],current_moving_shape.width,length)
      }else if (current_moving_point == "width"){
        xy = draw_canvas_to_coordinates(current_moving_shape.x,current_moving_shape.y)
        length = (abs(xy[0] -mouseX))*2
        ellipse(xy[0],xy[1],length,current_moving_shape.height)
      }
    }
  }
  
  for(i=0;i<shapes.length;i++){
    lx = (i*20)+10
    listy= (i*40)
    s= shapes[i]
    if(s.shape=="ellipse"){
      
      xy = draw_canvas_to_coordinates(s.x,s.y)
      if(loaded_shape_index != null && s === shapes[loaded_shape_index]){
        fill(s.cr,s.cg,s.cb)
        stroke(255,0,0)
        ellipse(xy[0],xy[1],s.width,s.height)
        //draw POIs
        fill(0,255,0)
        noStroke()
        ellipse(xy[0]+s.width/2,xy[1],5,5)
        ellipse(xy[0]-s.width/2,xy[1],5,5)
        ellipse(xy[0],xy[1]+s.height/2,5,5)
        ellipse(xy[0],xy[1]-s.height/2,5,5)
      }else{  //plain view
        stroke(0)
        fill(s.cr,s.cg,s.cb)
        ellipse(xy[0],xy[1],s.width,s.height)
      }
      
      fill(0)
      codebox = select("#codebox")
      new_code = codebox.value()
      fill_code = "fill("+s.cr+","+s.cg+","+s.cb+")"
      text(fill_code,800,lx)
      shape_code = "ellipse("+s.x+","+s.y+",50,50)"
      text(shape_code,800,lx+10)
      new_code = new_code + "\n" + fill_code
      new_code = new_code + "\n" + shape_code

      codebox.elt.value = new_code
    }
    
    //box for sort list
    fill(255)
    if(loaded_shape_index != null && loaded_shape_index ===i){
      stroke(255,0,0)
    }else{
      noStroke() 
    }
    rect(1000,listy,200,40)
    stroke(0)
    strokeWeight(2)
    text(i+1+" - "+s.shape,1005,listy+20)

  }
  


  fill(0)
  rect(1200,0,400,10)
  stroke(255)
  text(frameRate().toFixed(2),1200,10)
  
}