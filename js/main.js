$(document).ready(function () {
    let cells_count_input = $('input#fields_count'),
        alert = $('div#alert-area'),
        gaming_area = $('div#main-field'),
        game_is_started = false,
        set;

    let game = {
        cells_count : 0,
        speed : 20,
        snake_position : [],
        snake_length : 0,
        direction : null,
        positionX : null,
        positionY : null,
        count_area : null,

        getDomEl : function (position) {
          return $('div.row[data-id=' + position[0] + '] > div.cell[data-id=' + position[1] + ']');
        },

        snakeBorn : function () {
            let center = Math.round(this.cells_count / 2 -1);
            this.getDomEl([center, center]).addClass('head');
            this.positionX = center;
            this.positionY = center;
            this.snake_position.push([this.positionX , this.positionY]);
            this.snake_length++;
            this.createFood();
            game_is_started = true;
            this.count_area.html(this.snake_length);
        },

        createFood : function () {
          let randX = Math.floor(Math.random()*this.cells_count),
              randY = Math.floor(Math.random()*this.cells_count),
              foundPlace = this.getDomEl([randX, randY]);

          if(!foundPlace.hasClass('black')){
              foundPlace.addClass('red')
          }else {
             this.createFood();
          }

        },

        drawSnake : function () {
            gaming_area.find('.black').removeClass('black');
            gaming_area.find('.head').removeClass('head');
            for(let i = 0; i < this.snake_length ; i++){
                let coordinates = this.snake_position[i];
                if(i === 0){
                    this.getDomEl(coordinates).addClass('head');
                } else {
                    this.getDomEl(coordinates).addClass('black');
                }
            }
        },

        gameOver : function () {
            clearInterval(set);
            let record = +window.localStorage.getItem('snake_record');
            if(record === null || record === 0) {
                window.localStorage.setItem('snake_record' , JSON.stringify(this.snake_length));
                alert.html('You lose <br> <b>You have NEW record ' + this.snake_length + '</b>');
            }else {
                if(record < this.snake_length){
                    alert.html('You lose <br> <b>You have NEW record ' + this.snake_length + '</b>');
                }else {
                    alert.html('You lose <br> <b>Your record is ' + record + '</b>');
                }
            }
            this.direction = null;
            this.positionX = null;
            this.positionY = null;
            alert.fadeIn();
            alert.addClass('alert-danger');
            game_is_started = false;
            return false;
        },

        moveSnake : function () {
            let next_position = this.getDomEl(this.snake_position[0]);
            if(next_position.hasClass('red')){
                next_position.removeClass('red');
                switch (this.direction){
                    case ('up') : this.snake_position.push([this.snake_position[this.snake_length-1][0] , this.snake_position[this.snake_length-1][1]]);
                    break;
                    case ('down') : this.snake_position.push([this.snake_position[this.snake_length-1][0] , this.snake_position[this.snake_length-1][1]]);
                    break;
                    case ('right') : this.snake_position.push([this.snake_position[this.snake_length-1][0] , this.snake_position[this.snake_length-1][1]]);
                    break;
                    case ('left') : this.snake_position.push([this.snake_position[this.snake_length-1][0] , this.snake_position[this.snake_length-1][1]]);
                    break;
                }
                this.snake_length++;
                this.count_area.html(this.snake_length);
                this.createFood();
                console.log(this.snake_position);
            }
            if(next_position.hasClass('black')){
                this.gameOver();
            }
            this.drawSnake();
        },

        moveUp : function () {
            this.direction = 'up';
            clearInterval(set);
            set = setInterval(function () {
                game.positionX--;
                if(game.positionX < 0){
                    game.gameOver();
                }
                game.snake_position.pop();
                game.snake_position.unshift([game.positionX , game.positionY]);
                game.moveSnake();
            }, this.speed);
        },

        moveDown : function () {
            this.direction = 'down';
            clearInterval(set);
            set = setInterval(function () {
                game.positionX++;
                if(game.positionX > game.cells_count -1){
                    game.gameOver();
                }
                game.snake_position.pop();
                game.snake_position.unshift([game.positionX , game.positionY]);
                game.moveSnake();
            }, this.speed);
        },

        moveRight : function () {
            this.direction = 'right';
            clearInterval(set);
            set = setInterval(function () {
                game.positionY++;
                if(game.positionY > game.cells_count -1){
                    game.gameOver();
                }
                game.snake_position.pop();
                game.snake_position.unshift([game.positionX , game.positionY]);
                game.moveSnake();
            }, this.speed);
        },

        moveLeft : function () {
            this.direction = 'left';
            clearInterval(set);
            set = setInterval(function () {
                game.positionY--;
                if(game.positionY < 0){
                    game.gameOver();
                }
                game.snake_position.pop();
                game.snake_position.unshift([game.positionX , game.positionY]);
                game.moveSnake();
            }, this.speed);
        },

        generateGamingArea : function () {
            alert.fadeOut();
            this.snake_position = [];
            this.snake_length = 0;
            let max = this.cells_count,
                div = $('<div></div>');
            this.count_area = $('<div class="snake_length"></div>');

            for(let i = 0 ; i < max ; i++){
                let row = $('<div class="row" data-id="'+i+'"></div>');
                for(let i = 0; i < max; i++){
                    let cell = $('<div class="cell" data-id="'+i+'"></div>');
                    row.append(cell)
                }
                div.append(row)
            }
            gaming_area.css({
                'width' : max*25 + 'px',
                'border' : '1px solid #ccc'
            });
            gaming_area.html(div);
            gaming_area.append(this.count_area);
            this.snakeBorn()
        },
    };

    $('#start').click(function () {
        if(!game_is_started) {
            let cells_count = +cells_count_input.val();
            if($.trim(cells_count) === '' || cells_count === 0){
                alert.html('Length field can not be empty or 0');
                alert.fadeIn();
                alert.addClass('alert-danger');
            }else if(cells_count < 10){
                alert.html('Length field can not be less than 10');
                alert.fadeIn();
                alert.addClass('alert-danger');
            } else{
                game.cells_count = cells_count;
                game.speed = +$('#speed').val();
                game.generateGamingArea();
            }
        }

    });

    $('#pause').click(function () {
        clearInterval(set)
    });

    $(document).on('keydown', function (event) {
        if(game_is_started){
            switch (event.keyCode){
                case (37) : if(game.direction !== 'left' && game.direction !== 'right'){game.moveLeft()}
                break;
                case (38) : if(game.direction !== 'up' && game.direction !== 'down'){game.moveUp()}
                break;
                case (39) : if(game.direction !== 'left' && game.direction !== 'right'){game.moveRight()}
                break;
                case (40) : if(game.direction !== 'up' && game.direction !== 'down'){game.moveDown()}
                break;
            }
        }
    })

});