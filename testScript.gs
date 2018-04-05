//Dit is een testscript om de stringmanipulaties te testen.
//

function testProcessMarineTrafficMail(){
  //Deze string wordt getest en verwerkt.
  //var subject = "Arrival: VOS PRUDENCE, Port: TANGER MED ANCH";
  //var subject = "Departure: VOS PRUDENCE, Port: TANGER MED ANCH";
  //var subject = "Departure: VOS PRUDENCE, Port: SAIPEM 12000";
  var subject = "Departure: VOS PRUDENCE, Port: SAIPEM 12000";
       
      var beweging = "";
      var tweetmsgbegin = '#mensensmokkel: NGO Smokkelschip';
      var commapos = subject.indexOf(',');
      var shipsnamestart = subject.indexOf(':')+2;
      var portnamestart = subject.lastIndexOf('Port')+5;   // De : gaat niet goed bij departures.
      var endsubjectstr = subject.length;
      var continueprocessing = false;
          
      //nu er iets mee doen
      //maar alleen als het aankomst of vertrek is (beweging).
      //voorbeeld: Arrival: SEA-WATCH TANGO, Port: VALLETTA      
      //voorbeeld: Departure: SEA-WATCH TANGO, Port: VALLETTA
  

      //------beweging------  
      if (subject) {
        if (subject.indexOf('Arrival') > -1) {
          beweging = "aangekomen";
          Logger.log('beweging:' + beweging);
          continueprocessing = true;
        }
      }
         
      if (subject) {
        if (subject.indexOf('Departure') > -1) {
          beweging = "vertrokken";
          Logger.log('beweging:' + beweging);     
          continueprocessing = true;
        }
      }
      
  
      //
      if (continueprocessing){
        
        //------namen------  
        var shipsname = subject.substring(shipsnamestart, commapos).toProperCase();
        Logger.log('shipsname:' + shipsname);     
        var portname = subject.substring(portnamestart, endsubjectstr).trim().toProperCase(); //trim omdat er nog een space blijft hangen voor de naam ivm. zoeken op Port ipv ;
        Logger.log('portname:' + portname);     

        //-----------------------------------Vanaf hier identiek aan testScript.gs tot EINDE identiek---------------------------------------------
        //------correctie begin------  
        if (shipsname == "C Star") { 
          tweetmsgbegin = "SAR missie van #defendeurope:  ";
        }        
        
        //------correctie voorzetsel + portname------  
        var voorzetsel = 'ín';       
        //Lampedusa
        if (portname == "Lampedusa Anch") { 
          if (beweging == "aangekomen") { 
            beweging = "voor anker gegaan";
            voorzetsel = 'op';
          }
         if (beweging == "vertrokken") { 
            voorzetsel = 'van';
          }
          portname = "de reede van Lampedusa";
        }        
        //Trapani
        if (portname == "Trapani Anch") { 
          if (beweging == "aangekomen") { 
            beweging = "voor anker gegaan";
            voorzetsel = 'op';
          }
         if (beweging == "vertrokken") { 
            voorzetsel = 'van';
          }
          portname = "de reede van Trapani";
        }  
        //Malta
        if (portname == "Malta Anch") { 
          if (beweging == "aangekomen") { 
            beweging = "voor anker gegaan";
            voorzetsel = 'op';
          }
         if (beweging == "vertrokken") { 
            voorzetsel = 'van';
          }
          portname = "de reede van Malta";
        }  
        //Tanger
        if (portname == "Tanger Med Anch") { 
          if (beweging == "aangekomen") { 
            beweging = "voor anker gegaan";
            voorzetsel = 'op';
          }
         if (beweging == "vertrokken") { 
            voorzetsel = 'van';
          }
          portname = "de reede van Tanger";
        }          
        //SAIPEM 12000
        if (portname == "Saipem 12000") { 
            voorzetsel = 'bij de';
            tweetmsgbegin = ''; // geen mensensmokkelactiviteit 
        }     
        //-----------------------------------EINDE identiek---------------------------------------------
        
        //Tweet samenstellen
        tweetmsg = tweetmsgbegin + ' ' + shipsname + ' ' + beweging + ' ' + voorzetsel + ' ' + portname + '. ';
        Logger.log (tweetmsg);
        
      }
     
    }
    




String.prototype.toProperCase = function () {
//Function to return all words in a string capitalized
/* 
https://www.w3schools.com/jsref/jsref_obj_regexp.asp
https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript/196991#196991
*/
      return this.replace(/\b\w+/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
