$(document).ready(function (){
  setInterval(function()
  {
    var randPercent = Math.random() * 0.5;
    var color = '#90A4AE';
  
    if(randPercent*200 >= 90){
      color = '#FF3D00';
    }
    else if(randPercent*200 < 90 && randPercent*200 >= 60){
      color = '#81C784';
    }
    else if (randPercent*200 < 60 && randPercent*200 >= 40){
      color = '#FFEB3B';
    }
    else if (randPercent*200 < 40 && randPercent*200 >= 10){
      color = '#FF9800';
    }
    else if (randPercent*200 < 10 && randPercent*200 >= 0){
      color = '#FF3D00';
    }

    var USERNAME = $('#username').html();
    var now = new Date(Date.now())

    /********* ------UPDATE TANK LEVEL-------*************/

    $.ajax
    ({
      type:'post',
      url:'UpdateTable.php',
      data:{
      curHeight : randPercent*200,
      USERNAME : USERNAME
      },
      success:function(response)
      {
        if(response== "Success")
        {
          /*$('#error').text("Updated").css({"color":"green"});*/
        }
        else if(response == "Fail")
        {
          percantageValue.textContent = `--`;
          indicatorValue.style.transform = `rotate(0turn)`
          $('#error').text(response).css({"color":"red"});
        }
        else
        {
          percantageValue.textContent = `--`;
          indicatorValue.style.transform = `rotate(0turn)`
          $('#error').text("Unknown Error").css({"color":"red"});
        }
      }
    });

  /********* ------UPDATE TANK LEVEL ENDS HERE-------*************/

  /********* ------DISPLAY TANK LEVEL-------*************/
    $.ajax
    ({
      type:'post',
      url:'BasicData.php',
      data:
      {
        USERNAME : USERNAME
      },
      success:function(response){
        if(response!="Fail")
        {
          $('#currentheightshow').text(jQuery.parseJSON(response).VariableHeight);
          $('#totalheightshow').text((jQuery.parseJSON(response)).TotalHeightTank); 
        }
        else if(response == "Fail")
        {
          $('#error').text(response).css({"color":"red"});
          indicatorValue.style.transform = `rotate(0turn)`
          percantageValue.textContent = `--`;
        }
      }
    });

  /********* ------DISPLAY TANK LEVEL ENDS HERE-------*************/

    var d = new Date();
    let indicatorValue = document.querySelector(".gauge_fill");
    let percantageValue = document.querySelector(".gauge_cover");
    indicatorValue.style.transform = `rotate(${randPercent}turn)`;
    indicatorValue.style.background = color;
    percantageValue.textContent = `${Math.round(randPercent*200)}%`;
    $("#percentageshow").text(Math.round(randPercent*200).toString() + "%");
  }, 10000);

  setInterval(function(){

    /********* ------UPDATE DAILY TANK LEVEL DATA-------*************/

    var USERNAME = $('#username').html();
    var now = new Date(Date.now())
    var currentlevel = $('#currentheightshow').html();
    var totalheightlevel = $('#totalheightshow').html()
    var CurrentDate = now.getFullYear().toString()+"-"+(now.getMonth()+1).toString()+"-"+now.getDate().toString();
    var CurrentTime = getTime();
    var TimeID = now.getHours()+""+now.getMinutes()+""+now.getSeconds()+""+now.getMilliseconds()
    console.log(USERNAME);

    $.ajax
    ({
      type:'post',
      url:'DailyRecordUpdate.php',
      data:{
       TimeID : TimeID,
       CurrentDate : CurrentDate,
       currentlevel : currentlevel,
       totalheightlevel : totalheightlevel,
       CurrentTime : CurrentTime,
       databaseName :  USERNAME
      },
      success:function(response) {
        if(response === "success")
        {
          console.log(response);
          $('#error').text("Updated").css({"color":"green"});
          $("#lastupdated").text(new Date().toTimeString().split(" ")[0])
        }
        else if(response === "Fail")
        {
          $('#error').text(response).css({"color":"red"});
        }
        else
        {
            console.log(response);
            $('#error').text("Updated").css({"color":"green"});
            $("#lastupdated").text(getTime());
        }
      }
    });

    /********* ------UPDATE DAILY TANK LEVEL DATA ENDS HERE-------*************/

  },10000);

  var USERNAME = $('#username').html();


  setInterval(function(){
    getData();
  },1000);


  function getData()
  {
      $.ajax({
        type:'GET',
        url:'WholeTableData.php',
        data:{
          USERNAME : USERNAME
        },
        success:function(response) {
          console.log(response);
          $('.tableIndiactor').html(response);
        }
      });
  }

  $('#search_text').keyup(function(){
    var txt = $(this).val();
      if(txt  != '')
      {
        $.ajax({
        type:'post',
        url:'SearchData.php',
        data:{
          USERNAME : USERNAME,
          search : txt
            },
              dataType: "text",
              success:function(response) {
              $('.tableIndiactor').html(response);
            }
          });
      }
      else
      {
        $('.tableIndiactor').html('');
        $.ajax({
          type:'post',
          url:'SearchData.php',
          data:{
            USERNAME : USERNAME,
            search : txt
            },
              dataType: "text",
              success:function(response) {
              $('.tableIndiactor').html(response);
            }
          });
        }
    });

  function getTime()
  {
    var dt = new Date();
    var h =  dt.getHours(), m = dt.getMinutes();
    var _time = (h > 12) ? (h-12 + ':' + m +":"+dt.getSeconds()+' PM') : (h + ':' + m +":"+dt.getSeconds()+' AM');
    console.log(_time);
    return _time;
  }
});