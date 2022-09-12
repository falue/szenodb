let firstNames = ["Abi", "Adalie", "Aita", "Albula", "Alyssia", "Amrei", "Andel", "Andrin", "Andrin", "Anica", "Annatina", "Anneli", "Anneli", "Annely", "Annigna", "Annina", "Antonette", "Arale", "Arianita", "Armida", "Armide", "Atreju", "Ayla", "Badin", "Balz", "Barbli", "Beat", "Beat", "Beath", "Beath", "Bendicht", "Bendicht", "Benedikt", "Bengiamin", "Benjas", "Bensehilla", "Bern", "Bernhardin", "Berti", "Bethli", "Bigna", "Binia", "Brandi", "Carissima", "Chasper", "Chatrina", "Chatrina", "Chonz", "Cilgia", "Cla", "Conz", "Corina", "Corinne", "Corsica", "Dani", "Daron", "David", "Divico", "Dorli", "Dumeng", "Dumeni", "Dumeni", "Duri", "Eliane", "Elijan", "Elsa", "Elsi", "Elsy", "Elvezia", "Elvezia", "Emerita", "Emma", "Enie", "Erika", "Erina", "Ernestin", "Fabian", "Fabiola", "Fadri", "Ferdi", "Florin", "Florina", "Flurin", "Flurina", "Franklin", "Franzi", "Fränzi", "Fridolin", "Fridolina", "Friedolin", "Frillix", "Gaudenz", "Gian", "Gianin", "Gianrico", "Gieri", "Gilgian", "Gilgian", "Gillis", "Giuanna", "Giulitta", "Giusep", "Göpf", "Gritli", "Gritli", "Gwer", "Hänggi", "Hanneli", "Hanni", "Hans", "Hans-Rudolf", "Harri", "Heidi", "Heiri", "Helvetia", "Ingenuin", "Inglina", "Innegrit", "Irmalin", "Irmeli", "Irmelin", "Isalie", "Jelsha", "Jilge", "Jo", "Jockel", "Jocki", "Jocky", "Joder", "Jonin", "Jöri", "Jost", "Jovin", "Jovin", "Jürg", "Kaja", "Karin", "Katrin", "Ladina", "Lanessa", "Leon", "Levio", "Lisa", "Lisa-Maria", "Lisa-Katharina", "Lisi", "Loan", "Lorian", "Lorin", "Luc", "Ludewiga", "Lumi", "Lyan", "Madlaina", "Madleina", "Magali", "Marei", "Marilen", "Mark", "Markus", "Marleen", "Maya", "Meinrad", "Melia", "Melinda", "Menga", "Meret", "Midja", "Mylene", "Nando", "Neamy", "Nette", "Niklaus", "Nordin", "Norina", "Pascale", "Paschalis", "Ramona", "Reto", "Reto", "Rita", "Roger", "Rolf", "Rösli", "Ruedi", "Ruedi", "Sana", "Seina", "Selma", "Seraina", "Sereina", "Severin", "Severine", "Simon", "Susi", "Tell", "Töbe", "Ueli", "Urban", "Urs", "Ursina", "Uto", "Vera", "Vreni", "Vroni", "Walo", "Wendelin", "Rösi"]
let lastNames = ["Müller", "Meier", "Schmid", "Keller", "Weber", "Schneider", "Huber", "Meyer", "Steiner", "Fischer", "Baumann", "Frei", "Brunner", "Gerber", "Widmer", "Zimmermann", "Moser", "Graf", "Wyss", "Roth", "Suter", "Baumgartner", "Bachmann", "Studer", "Bucher", "Berger", "Kaufmann", "Kunz", "Hofer", "Bühler", "Lüthi", "Lehmann", "Marti", "Frey", "Christen", "Koch", "Egli", "Favre", "Arnold", "Pfister", "Schweizer", "Wüthrich", "Fuchs", "Martin", "Stalder", "Gasser", "Peter", "Kohler", "Maurer", "Koller", "Wenger", "Zürcher", "Burri", "Furrer", "Egger", "Hofmann", "Michel", "Hunziker", "Leuenberger", "Bieri", "Ammann", "Vogel", "Hug", "Hess", "Tanner", "Sutter", "Hauser", "Blaser", "Rüegg", "Hartmann", "Schuler", "Rey", "Wagner", "Gisler", "Senn", "Zbinden", "Kälin", "Schär", "Siegenthaler", "Scherrer", "Flückiger", "Lang", "Zaugg", "Fankhauser", "Stucki", "Kuhn", "Imhof", "Vogt", "Bernasconi", "Scheidegger", "Odermatt", "Portmann", "Küng", "Sommer", "Seiler", "Ackermann", "Liechti", "Jost", "Schmidt", "Schumacher", "Schärer", "Schwarz", "Stocker", "Staub", "Giger", "Hasler", "Schenk", "Rochat", "Lüscher", "Weiss", "Gloor", "Herzog", "Hofstetter", "Schwab", "Zehnder", "Stutz", "Pittet", "Rohner", "Weibel", "Schnyder", "Bosshard", "Wittwer", "Eichenberger", "Steiger", "Haas", "Schaller", "Stadelmann", "Rohrer", "Stettler", "Bolliger", "Stöckli", "Tobler", "Sieber", "Siegrist", "Wolf", "Sigrist", "Meister", "Marty", "Ulrich", "Lutz", "Lanz", "Blanc", "Röthlisberger", "Grob", "Kaiser", "Steffen", "Betschart", "Locher", "Beck", "Aeschlimann", "Blum", "Bühlmann", "Probst", "Mathys", "Rossi", "Schmutz", "Kessler", "Kuster", "Häfliger", "Muller", "Steinmann", "Stauffer", "Haller", "Graber", "Krebs", "Walker", "Ziegler", "Nussbaumer", "Benz", "Jenni", "Friedli", "Käser", "Bischof", "Fässler", "Hostettler", "Aebi", "Richard", "Hürlimann", "Zwahlen", "Knecht", "Schaub", "Wehrli", "Eugster", "Mäder", "Walther", "Ott", "Flury", "Brügger", "Rossier", "Willi", "Erni", "Ryser", "Gut", "Wicki", "Reber", "Merz", "Thalmann", "Mettler", "Wirth", "Iten", "Garcia", "Heiniger", "Glauser", "Schütz", "Niederberger", "Bürgi", "Mathis", "Schüpbach", "Forster", "Wirz", "Bigler", "Clerc", "Achermann", "Gross", "Frischknecht", "Zingg", "Etter", "Jäggi", "Bösch", "Braun", "Ferrari", "Balmer", "Walter", "Trachsel", "Allemann", "Schlegel", "Kern", "Jakob", "Walser", "Fehr", "Bianchi", "Schoch", "Von", "Geiser", "Bürki", "Gfeller", "Iseli", "Sidler", "Zeller", "Bader", "Ritter", "Reymond", "Leu", "Amstutz", "Landolt", "Da", "Stadler", "Felder", "Hänni", "Tschanz", "Ernst", "Eberle", "Bärtschi", "Näf", "Germann", "Schönenberger", "Wild", "Birrer", "Monney", "Emmenegger", "Hodel", "Minder", "Affolter", "Eggenberger", "Zemp", "Winkler", "Isler", "Wälti", "Messerli", "Wiederkehr", "Burkhalter", "Sonderegger", "Neuenschwander", "Brand", "Brun", "Herrmann", "Baur", "Hirschi", "Dubois", "Schlatter", "Perrin", "Krähenbühl", "Maillard", "Grossenbacher", "Jenny", "Zuber", "Schneeberger", "Aebischer", "Mosimann", "Linder", "Beyeler", "Fontana", "Perret", "Rieder", "Gehrig", "Stähli", "Hutter", "Buser", "Miller", "Thoma"]
let techwords = ["CPU usage",
    "Memory usage",
    "GPU utilization",
    "GPU memory",
    "Network send",
    "Network receive",
    "Neuron count",
    "compression rate",
    "memory expansion rate",
    "logic amount",
    "logic complexity",
    "CPU cores",
    "GPU memory",
    "max. GPU memory bandwith",
    "GPU tensor cores",
    "memory usage",
    "CPU usage",
    "Memory usage",
    "GPU utilization",
    "GPU memory",
    "FPS",
    "ms",
    "RHI",
    "Texture memory 2D",
    "Vertex buffer memory",
    "Structured buffer memory",
    "Ray Tracing Acceleration Structury memory",
    "Uniform buffer memory",
    "Pixel buffer memory",
]
domains = ["cbx.ch", "cbx.net", "greenmail.ch", "coldmail.com", "bmail.com", "protonmail.com", "domainhost.com", "mpoint.ch", "greenest.ch"]

function getNames() {
    gebi('names').innerHTML =  "";
    gebi('namesShort').innerHTML =  "";
    gebi('projectNames').innerHTML =  "";
    gebi('techwords').innerHTML =  "";
    gebi('emails').innerHTML =  "";
    let count = gebi('count').value || 20;
    for (let i = 0; i < count; i++) {
        let firstName = getRandomElement(firstNames);
        let lastName = getRandomElement(lastNames);
        gebi('names').innerHTML += `<br>${firstName} ${lastName}`;
        gebi('namesShort').innerHTML += `<br>${firstName[0]}. ${lastName}`;
        gebi('emails').innerHTML += `<br>${makeEmail(firstName, lastName)}`;
        gebi('projectNames').innerHTML += `<br>proj-${scrambleWord(getRandomElement(techwords).split(" ")[0].toLowerCase())}-${createUniqueId(6)}`;
        gebi('techwords').innerHTML += `<br>${chooseRandomKeys(randomBetween(1,3), techwords).join(" ")}`;
    }
}

function scrambleWord( text ) {
    return text.replace(
     /\b([a-z])([a-z]+)([a-z])\b/gi,
     function( t, a, b, c ) {
      b = b.split( /\B/ );
      for( var i = b.length, j, k; i; j = parseInt( Math.random() * i ),
       k = b[--i], b[i] = b[j], b[j] = k ) {}
      return a + b.join( '' ) + c;
     }
    );
   }

   function makeEmail(firstname, lastname) {
    var firstname, lastname, special_char_map;
    let emailfield = "";
    
    if (randomBetween(0, 100) < 50) {
      emailfield += `${firstname}${lastname}`;
    } else {
      if (randomBetween(0, 100) < 50) {
        emailfield += `${firstname[0]}.${lastname}`;
      } else {
        if (randomBetween(0, 100) < 50) {
          emailfield += `${firstname}${randomBetween(75, 99)}`;
        } else {
          emailfield += lastname;
        }
      }
    }
    
    emailfield += "@";
    emailfield += getRandomElement(domains);
    return replaceUmlaute(emailfield.toLowerCase());
   }
  
  function replaceUmlaute(str) {
    const umlautMap = {
        '\u00dc': 'UE',
        '\u00c4': 'AE',
        '\u00d6': 'OE',
        '\u00fc': 'ue',
        '\u00e4': 'ae',
        '\u00f6': 'oe',
        '\u00df': 'ss',
    }
    return str
      .replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
        const big = umlautMap[a.slice(0, 1)];
        return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1);
      })
      .replace(new RegExp('['+Object.keys(umlautMap).join('|')+']',"g"),
        (a) => umlautMap[a]
      );
  }