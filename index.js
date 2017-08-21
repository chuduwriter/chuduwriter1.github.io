var name = "zhangsan";
var age = 20;



function Student(name,age){
  this.name = name;
  this.age = age;

  this.toString = function(){
    alert("name:"+this.name+",age:"+this.age);
  }
}


new Student("wu",123).tostring();