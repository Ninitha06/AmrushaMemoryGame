class Game{

    constructor(){
     
    }
    
    
    getState(){
      var stateref = database.ref("gameState");
      stateref.on("value",function(data){
      gameState = data.val();
      })
    }

    updateState(gameState){
      database.ref("/").update({
      gameState:gameState
    })
    }

    readMatchingTiles(){
      
      database.ref("matchingTiles").on("value",function(data){
        matchingTiles = data.val();
        console.log(matchingTiles);
      })
      
    
    }
    
    async start(){
      if(gameState == 0){
        player = new Player();
         var playerCountref = await database.ref("playerCount").once("value");
        if(playerCountref.exists()){
          playerCount = playerCountref.val()
             player.getCount();
         }
        
        form = new Form();
        form.display();
        this.readMatchingTiles();
        console.log(matchingTiles);
        this.readMatchedSprites();
        
      }
      let y = 0;
      let x = 0;
      for(var i=0;i<maxTiles;i++){
          
        tiles[i] = createSprite(round(width/2.2+50*x+10),height/2+y,40,50);
        tiles[i].addImage(tileCover);
        tiles[i].scale = 0.15;
         x = x + 1;
          if((i+1)%5 == 0){
            y = y+ 60;
            x = 0;
          }
      }
    }


    play()
    {
      form.hide();
      textSize(50);
      text("Player " + turn + " turn ", width/5-150,100)
      
      if(turn === 1 && player.index===1){
        allowClick = true;
        
      }
      else if(turn ===2 && player.index===2){
        allowClick = true;
      }

      if(matchedSprites){
        for(var num in matchedSprites){
          tiles[num].remove();
          tiles[matchedSprites[num]].remove();
        }
      }
      

      if(matchingTiles){
      

        if(allowClick){
          for(let i =0;i<tiles.length;i++){
            if(mousePressedOver(tiles[i]) && clickMouse){
              if(click==0){
                tiles[i].addImage(tileImages[matchingTiles[i].image]);
                tiles[i].scale=0.4;
                click = click + 1;
                matchNum1 = i;
                clickMouse = false;
              }
              if(click==1 && i!=matchNum1){
                tiles[i].addImage(tileImages[matchingTiles[i].image]);
                tiles[i].scale=0.4;
                click = click + 1;
                matchNum2 = i;
                clickMouse = false;
              }
            }
          }
        }    
            if(click == 2){
              allowClick = false;
              if(matchingTiles[matchNum1].match === matchNum2){
                tiles[matchNum1].remove();
                tiles[matchNum2].remove();
                this.updateMatchedSprites(matchNum1,matchNum2);
              }
              else{
                tiles[matchNum1].addImage(tileCover);
                tiles[matchNum1].scale = 0.15;
                tiles[matchNum2].addImage(tileCover);
                tiles[matchNum2].scale = 0.15;
                if(turn == 1)
                  this.updateTurn(2);
                else
                  this.updateTurn(1);
              }
              click = 0;
            }
        
        drawSprites();
      }
    }
    
    updateTurn(turn){
      database.ref('/').update({
        turn : turn
      })
    }

    getTurn(){
      var turnRef = database.ref("turn");
      turnRef.on("value",function(data){
        turn = data.val();
      })
    }
    
    updateMatchedSprites(matchNum1,matchNum2){
      var updates = {};
      updates[matchNum1] = matchNum2;
      database.ref("matchedSprites").update(updates);
      
    }

    readMatchedSprites(){
      database.ref("matchedSprites").on("value",function(data){
        matchedSprites = data.val();
      })
    }
}