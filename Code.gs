/*
Dit script draait elke 30 min.

Werking:
MarineTraffic alerts worden als mail ontvangen en gelabeld in gmail.
Dit script checkt voor relevante email en extract daaruit een twitter message 
Stuurt mail met twitter message naar deze mailbox
IFTTT pakt het vervolgens op en plaatst het als tweet in het connected buffer channel
Buffer tweet het met het roonbot2 account

Zie voor fleet documentatie: scriptProperties 'Fleetdocumentatie'

Configuratie:
scriptProperties key: mailbox2Tweet
*/

function processMarineTrafficMail(){
    
  var label = GmailApp.getUserLabelByName("MarineTraffic");  
  if(label == null){
    //Er zijn geen mails met dit label
    
  }
  else{
    var threads = label.getThreads();  

    for (var i = 0; i < threads.length; i++) {  
      
      var message = threads[i].getMessages()[0];
      var from = message.getFrom();
      var subject = message.getSubject();
      var msgcontent = message.getRawContent()
      Logger.log (subject);
      
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
  
      if (subject) {
        if (subject.indexOf('Arrival') > -1) {
          beweging = "aangekomen in";
          continueprocessing = true;
        }
      }
         
      if (subject) {
        if (subject.indexOf('Departure') > -1) {
          beweging = "vertrokken uit";
          continueprocessing = true;
        }
      }
        
      if (continueprocessing){
        
        //namen uit het subject vissen
        var shipsname = subject.substring(shipsnamestart, commapos).toProperCase();
        var portname = subject.substring(portnamestart, endsubjectstr).trim().toProperCase(); //trim omdat er nog een space blijft hangen voor de naam ivm. zoeken op Port ipv ;


      //------beweging------  
      if (subject) {
        if (subject.indexOf('Arrival') > -1) {
          beweging = "aangekomen";
          Logger.log('beweging:' + beweging);
          var voorzetsel = 'in';    
          continueprocessing = true;
        }
      }
         
      if (subject) {
        if (subject.indexOf('Departure') > -1) {
          beweging = "vertrokken";
          Logger.log('beweging:' + beweging);     
          var voorzetsel = 'uit';             
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

       //------correctie begin------  
        if (shipsname == "C Star") { 
          tweetmsgbegin = "SAR missie van #defendeurope:  ";
        }        
        
        //------correctie voorzetsel + portname------    
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
        
        //marinetraffic.com Link eruit peuteren
        //voorbeeld link van "Position and track. (Datum en tijd ook uit de mail overnemen!)
        //http://www.marinetraffic.com/en/ais/home/oldshipid:5014988/oldmmsi:211773720/zoom:10/olddate:2017-07-02 09:07
        //oldshipid en olddate zijn uniek. 
        //Logger.log (msgcontent);   
        var oldshipPos = msgcontent.indexOf('oldshipid');
        var olddatePos = msgcontent.indexOf('olddate');   
        var linktext = msgcontent.substring(oldshipPos - 41,olddatePos + 24);
        linklength = linktext.length;
        var tijdtext = linktext.substring((linklength -5),linklength);
        linktext = linktext.substring(0,linktext.length - 6).concat("%20").concat(tijdtext);
        //Logger.log ('linktext = '+ linktext);
     
        //url shorten
        var url = UrlShortener.Url.insert({longUrl: linktext});
        //Logger.log ('Shortened URL is ' + url.id) ;
        
        //Tweet samenstellen
        tweetmsg = tweetmsgbegin + ' ' + shipsname + ' ' + beweging + ' ' + voorzetsel + ' ' + portname + '. ' + url.id;
        Logger.log ('tweetmsg:' + tweetmsg);
        
        //tweet mailen
        var scriptProperties = PropertiesService.getScriptProperties();
        var mailbox2Tweet = scriptProperties.getProperty('mailbox2Tweet');  
        try {
          //send mail to account that is set up to tweet the body of this email message        
          MailApp.sendEmail(mailbox2Tweet, '#mensensmokkel', tweetmsg);
          Logger.log ('sent email to: ' + mailbox2Tweet + ' subject:' + subject + ' contents' + tweetmsg);    
          
          //gelukt, dan mail verwijderen
          threads[i].moveToTrash();
          Logger.log ('trashed email: '+ subject); 
          
        }  catch (err) {
          // handle the error here
          Logger.log ('MailApp.sendEmail error:' + err);
        }
                
      }
     
    }
    
  }

}
}

String.prototype.toProperCase = function () {
/* 
Function to return all words in a string capitalized
https://www.w3schools.com/jsref/jsref_obj_regexp.asp
*/
      return this.replace(/\b\w+/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
