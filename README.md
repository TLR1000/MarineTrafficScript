# MarineTrafficScript
Maakt van MarineTraffic.com meldingen tweets

Dit script draait elke 30 min.

Werking:
Checkt voor relevante email en extract daaruit een twitter message 
Stuurt mail met twitter message naar deze mailbox
IFTTT pakt het vervolgens op en plaatst het als tweet in het connected buffer channel
Buffer tweet het met het roonbot2 account

Zie voor fleet documentatie: scriptProperties 'Fleetdocumentatie'

Configuratie:
scriptProperties key: mailbox2Tweet
