$(document).ready(function(){
  // Inicializar variables
	var snake_array; // Creamos la serpiente. Es un array de "celdas"
	var cw = 10; // El tamaño de las celdas será de 10 px
	var d; // Dirección del movimiento
	var food;
	
	// Inicializar Canvas
	var canvas = $("#canvas")[0]; // La variable canvas contiene nuestro elemento <canvas>
	var ctx = canvas.getContext("2d"); // Inicializamos el contexto 2D del canvas en ctx
	var w = $("#canvas").width(); // Guardamos alto y ancho
	var h = $("#canvas").height();
	
	// Añadimos los controles del teclado
	// incluyendo una cláusula que impida ir "en sentido contrario"
	$(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
		// La serpiente ahora se puede controlar por teclado
	});
	
	// Creamos la serpiente
	function create_snake()
	{
		var length = 5; // Tamaño de la serpiente
		snake_array = []; //Inicializar el array vacío
		for(var i = length-1; i>=0; i--)
		{
			// Esto creará una serpiente horizontal 
			// empezando en la esquina superior izquierda
			snake_array.push({x: i, y:0});
		}
	}
	
	// Creamos la comida
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw),
		};
		// Esto creará una celda con los valores x e y
		// La creará entre 0 y w-cw o h-cw, es decir, dentro del cuadro
	}
	
	// Dibujo de los elementos del canvas
	function paint()
	{
		// Dibujar el canvas
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		
		// -- Movimiento de la serpiente --
		// La lógica es simple: quitar la cola del final y traerla al frente

		var nx = snake_array[0].x; // Guardamos la posición de la cabeza de la serpiente en nx y ny
		var ny = snake_array[0].y;
		
		// Modificamos esos valores en función de la dirección que tiene la serpiente
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;
		
		// Condiciones de final de partida
		// Reiniciará el juego si se sale del plano
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
		{
			// Reiniciar juego
			init();
			
			return;
		}
		
		// Si la nueva posición de la cabeza coincide con la comida,
		// Creamos una nueva cabeza en lugar de mover la cola
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score++;
			
			//Create new food
			create_food();
		}
		else
		{
			var tail = snake_array.pop(); // Sacamos la cola
			tail.x = nx; tail.y = ny; // Asignamos a la cola la posición de la cabeza
		}
		// La serpiente ha "comido" la nueva celda
		
		snake_array.unshift(tail); // Metemos la cola en la primera posición
		
		// Pintamos la serpiente
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			paint_cell(c.x, c.y);
		}
		
		// Pintamos la comida
		paint_cell(food.x, food.y);
		
		// Pintamos la puntuación
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
	}
	
	function paint_cell(x, y)
	{
		ctx.fillStyle = "blue";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	function check_collision(x, y, array)
	{
		// Comprobamos si las coordenadas x e y 
		// existen en un array de celdas
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}

	function init()
	{
		d = "right";  // Dirección del movimiento, por defecto a la derecha
		create_snake(); //Creamos la serpiente
		create_food();
		
		score = 0;
		
		// Para mover la serpiente utilizamos un timer que llamará
		// a la función paint() cada 60ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
	}
	
	init();
});
