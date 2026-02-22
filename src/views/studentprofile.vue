<template>
  <div class="page">


   <div class="left-bar">
    <h3 class="course">COURSE</h3>
    <p class="over">OVERVIEW</p>
    <div class="text-top">
    <ul class="dash-top">
    <li>Dashboard</li>
    <li >Inbox</li>
    <li >Lesson</li>
    <li >Task</li>
    <li>Group</li>
   </ul>
   </div>
 

   <div class="text-bottom">
    <p class="set" >SETTINGS</p>
   <ul class="dash-bottom">
    <li>⚙️Settings</li>
    <li class="logout">↩️logout</li>
   </ul>
   </div>
   </div>

    <div class="page-right">
     <div class="app">
    <div class="search-bar">
      <input type="text" placeholder="🔍 Search your course here...">
      <p class="filter-icon">⚙️</p>
    </div>

    <div class="banner">
      <p>ONLINE COURSE</p>
      <h1>Sharpen Your Skills With Professional Online Courses</h1>
      <button class="join-btn">Join Now <span>▶</span></button>
    </div>

    <div class="courses">
      <div v-for="i in 3" :key="i" class="card">
        <div class="icon">🔔</div>
        <div class="info">
          <span>2/8 Watched</span>
          <h3>Product Design</h3>
        </div>
        <div class="dots">⋮</div>
      </div>
    </div>
     </div>
    </div>
    
</div>

</template>

<style>
 body{
  background-color: rgb(242, 241, 240);
  width: 1340px;
 }
  .left-bar{
    border: 90px;
    color: rgb(0, 0, 0);
    background-color: rgb(255, 255, 255);
    height: 650px;
    width: 250px;
    margin: 30px 150px 30px 30px;
    border-radius: 20px;
  }
  .dash-top{
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .course{
    text-align: center;
    color:  #6332f6;
    padding-top:20px ;
     padding-bottom: 20px;
  
  }
  .text-top{
    padding-left: 50px;
  }
  .over{
    padding-left: 40px;
  }
  li{
    margin-bottom: 20px;
  }
  .dash-bottom{
      list-style: none;
    padding: 0;
    margin: 0;
    
  }
   .text-bottom{
    padding-left: 50px;
    padding-top: 200px;
  }

  .app { 
    font-family: sans-serif; 
     padding: 20px; 
     max-width: 1000px; 
      margin: auto;
     
    }

.search-bar { 
  display: flex;
   gap: 10px; 
   margin-bottom: 20px; 
   
  }

input { flex: 1; 
  padding: 10px; 
  border-radius: 10px; 
  border: 1px solid #ddd; 
}


.banner { 
  background: #6332f6; 
  color: white; 
  padding: 30px; 
  border-radius: 20px; 
  margin-bottom: 20px; 
}

.join-btn { 
  background: black; 
  color: white; 
  border: none; 
  padding: 10px 20px; 
  border-radius: 20px; 
  cursor: pointer; 
}

.courses {
   display: flex;
   gap: 15px; 
   flex-wrap: wrap;
   }
.card { 
  background: #f8f8f8;
   padding: 15px; 
   border-radius: 15px; 
   display: flex;
   align-items: center; 
   gap: 10px; flex: 1; 
   min-width: 200px;
}
.icon {
   background: #e0d5ff;
   padding: 10px;
   border-radius: 50%;
}

.info h3 {
   margin: 5px 0 0;
   font-size: 16px; 
}
.info span {
   font-size: 12px;
   color: gray;
}
.page{
  display: flex;
  justify-content: center;
} 
  
  .page-right{
    padding-bottom: 50px;
  }
  
.logout{
  color: rgb(205, 42, 42);
}
</style>

<script>

</script>
