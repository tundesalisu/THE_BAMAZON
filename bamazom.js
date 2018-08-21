var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",  
    // Your port; if not 3306
    port: 3306,  
    // Your username
    user: "root",    
    password: "root",
    database: "bamazon"
  });
  connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
    }
    console.log("Connection Successfully");
    makeTable();
  });
  var makeTable = function(){
      connection.query("SELECT * FROM products", function (err,res) { 
          for(var i = 0; i<res.length; i++){
              console.log(res[i].itemid + " :: " + res[i].productname + " :: " + 
                            res[i].departmentname + " :: " + res[i].price + " :: " + res[i].stockquantity + "\n");
          }
          promptCustomer(res);
       })
  }

  var promptCustomer = function(res){
      inquirer.prompt([{
          type: "input",
          name: "choice",
          message: "what would you like? [quit with Q]"
                }]).then(function(answer){
                    var correct = false;
                    if (answer.choice.toUpperCase()=="Q"){process.exit();}
                    for(var i = 0; i < res.length; i++){
                    if(res[i].productname==answer.choice){
                             correct = true;
            var product = answer.choice;
            var id = i;
                        inquirer.prompt({
                        type: "input",
                        name:"quant",
                        message: "how many would you like?",
                        validate: function(value){
                            if(isNaN(value)==false){
                                return true;
                            }else{return false;}
                        }
           
                    
                    }).then(function(answer){
                        if((res[id].stockquantity-answer.quant)>0){
                            connection.query("UPDATE products SET stockquantity = '"+(res[id].stockquantity-answer.quant)+"' WHERE productname = '"+product+"'",function(err,res2){
                                console.log("product purchsed");
                                makeTable();
                            })
                        }  else{console.log("Not a valid selection");
                            promptCustomer(res);
                         }
                    })





                    }
                }
                if(i == res.length && correct == false){
                    console.log("not valid selection");
                    promptCustomer(res);
                }
                })

  }