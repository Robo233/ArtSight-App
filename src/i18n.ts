import i18n, { changeLanguage } from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const setStoredLanguageOrDefault = () => {
  changeLanguage(localStorage.getItem("i18nextLng") ?? i18n.language);
  
};

export const getLanguageCode = () => {
  return i18n.language.split("-")[0];
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          shared: {
            artwork: "Artwork",
            exhibition: "Exhibition",
            artist: "Artist",
            artworkDetail: "Artwork detail",
            genre: "Genre",
            favorites: "Favorites",
            profile: "Profile",
            logIn: "Log in",
            settings: "Settings",
            information: "Information",
            loadMore: "Load more",
            maps: "Maps",
            artworks: "Artworks",
            genres: "Genres",
            exhibitions: "Exhibitions",
            artworkDetails: "Details of artworks",
            artists: "Artists",
            dimensions: "Dimensions",
            noResults: "No results",
            dateOfBirth: "Date of birth",
            dateOfDeath: "Date of death",
            phoneNumber: "Phone number",
            email: "Email address",
            webpage: "Webpage",
            socialMedia: "Social media",
            name: "Name",
            description: "Description",
            medium: "Medium",
            nonStop: "Non stop",
            startTime: "Start Time",
            endTime: "End Time",
            monday: "Monday",
            tuesday: "Tuesday",
            wednesday: "Wednesday",
            thursday: "Thursday",
            friday: "Friday",
            saturday: "Saturday",
            sunday: "Sunday",
            remove: "Remove",
            yours: "Yours",
            home: "Home",
            address: "Address",
            tooltip: {
              languages: "You can add content in multiple languages. The text will appear in the user's preferred language"
            },
            recentlyViewed: "Recently viewed",
          },
          startPage: {
            title: "Start Page",
            welcomeText: "All about art!",
            startPageButtonText: "Let's start",
          },
          userProfile: {
            youAreAGuest: "You are a guest",
            logOut: "Log out",
            account: "Account",
          },
          authForm: {
            signUp: "Sign up",
            continueWith: "Continue with",
            authentication: "Authentication",
          },
          chatBot: {
            startConversation: "Start conversation",
            askAi: "Ask an AI",
            suggestedQuestions: [
              "What are the main concepts?",
              "What does the artist want to say?",
              "Tell me more",
            ],
          },
          userModeSelection: {
            continueAsGuest: "Continue as guest",
            userSelection: "User Selection",
          },
          description: {
            readMore: "Read more...",
            readLess: "Read less",
          },
          settings: {
            theme: "Theme",
            language: "Language",
          },
          languageSettings: {
            languageNames: {
              en: "English",
              ro: "Romanian",
            },
          },
          themeSettings: {
            themeNames: {
              light: "Light",
              dark: "Dark",
            },
          },
          entityNotFound: {
            notFoundArtwork: "The artwork could not be found",
            notFoundArtist: "The artist could not be found",
            notFoundExhibition: "The exhibition could not be found",
            notFoundArtworkDetail: "The artwork detail could not be found",
            notFoundGenre: "The genre could not be found",
          },
          markerWithInfoWindow: {
            findOutMore: "Find out more",
          },
          maps: {
            lookAroundTheMap: "Look around the map for exhibitions",
          },
          camera: {
            scanAQR: "Scan a QR",
            permissionsErrorUserDeniedCameraAccess:
            "Allow camera access to continue.",
            pleaseWait: "Please wait...",
            cameraNotSupported: "Camera is not supported on this device",
            camera: "Camera",
          },
          artworkPage: {
            medium: "Medium",
            dimensions: "Dimensions",
            artworkFoundAt: "This artwork can be found at",
            otherArtworksBy: "Other artworks by",
            detailsOfTheArtwork: "Details of the artwork",
            otherArtworksFrom: "Other artworks from",
            analyzeArtworkUsingAI: "Analyze this artwork using AI"
          },
          artworkDetailPage: {
            detailBelongsToArtwork: "This detail belongs to:",
            otherDetails: "Other details of the artwork:",
          },
          artistPage:{
            artworksFromArtist: "Artworks of this artist",
          },
          exhibitionPage: {
            artworksFromExhibition: "Artworks from this exhibition",
            schedule: "Schedule",
          },
          genrePage: {
            artworksOfThisGenre: "Artworks of this genre",
          },
          artworkForm: {
            dimensionsPlaceholder: "e.g. 77 cm x 53 cm",
            generating: "Generating...",
            generateQR: "Generate QR Code",
            searchArtist: "Search for an artist...",
            tooltip: {
              dimensions: "The dimensions of the artwork. For paintings, provide both width and height together with the unit, (e.g., '77 cm x 53 cm').",
              genres: "The genres of the artwork. It can have multiple genres at the same time.",
              mainImage: "It's displayed on the top of the page. Choose an image that clearly represents the artwork.",
              location: "Select a location on the map if relevant (useful for artworks such as statues).",
              exhibition: "The exhibition where the artwork is displayed.",
              artist: "The artist who created the artwork.",
              name: "The name of the artwork.",
              description: "A description of the artwork. You can use simple markdown symbols (e.g., * for emphasis, _ for italic and # for headings) to format your text.",
              medium: "Medium used (e.g., oil or watercolor for paintings)."
            }
          },
          artworkDetailForm: {
            tooltip: {
              mainImage: "This is displayed on the top of the page. Choose an image that clearly represents the specific detail of an artwork.",
              artwork: "The artwork this detail belongs to",
              name: "The name of the detail of an artwork (e.g. Mona Lisa's gaze).",
              description: "A description of the artwork detail. You can use simple markdown symbols (e.g., * for emphasis, _ for italic and # for headings) to format your text.",
            }
          },
          artistForm: {
            tooltip: {
              genres: "Genres the artist works in.",
              mainImage: "This is displayed on the top of the page. Choose an image that clearly represents the artist, such as a portrait.",
              name: "The artist's name (e.g. Leonardo Da Vinci).",
              description: "A description of the artist. You can use simple markdown symbols (e.g., * for emphasis and # for headings) to format your text.",
              contactInformation: "Contact information for the artist. Useful for contemporary artists, with whom people may want to connect.",
              socialMedia: "Social media accounts of the artist. Useful for contemporary artists, with whom people may want to connect.",
              imageDescriptions: "Provide additional images that represent the artist. You can also add a description for each image."
            }
          },
          exhibitionForm: {
            date: "Date",
            noSchedule: "No schedule",
            fixedSchedule: "Fixed schedule",
            customSchedule: "Custom schedule",
            tooltip: {
              genres: "The genres of the artworks that are present at the exhibition.",
              mainImage: "This is displayed on the top of the page. Choose an image that clearly represents the exhibition, such as an image of the interior.",
              name: "The exhibition's name (e.g. Classic art exhibition).",
              description: "A description of the exhibition. You can use simple markdown symbols (e.g., * for emphasis, _ for italic and # for headings) to format your text.",
              address: "The address of the exhibition.",
              contactInformation: "Contact information for the exhibition.",
              socialMedia: "Exhibition social media links.",
              location: "Select the location of the exhibition on the map.",
              imageDescriptions: "Provide additional images that represent the exhibition. You can also add a description for each image.",
              schedule: "The schedule of the exhibition.",
              fixedSchedule: "Certain days of the week (e.g., Monday-Friday, 8 AM - 6 PM.)",
              customSchedule: "The exhibition is a one-time event that is held on specific dates, (e.g., April 5-6, 2025)."
            }
          },
          genreForm: {
            tooltip: {
              mainImage: "This is displayed on the top of the page. Choose an image that clearly represents the genre, such as famous artwork of this genre.",
              name: "The genre's name (e.g. Renaissance).",
              description: "A description of the genre. You can use simple markdown symbols (e.g., * for emphasis, _ for italic and # for headings) to format your text.",
              imageDescriptions: "Provide additional images that represent the genre. You can also add a description for each image.",
            }
          },
          gallerySection: {
            gallery: "Gallery",
          },
          modal: {
            cancel: "Cancel",
          },
          entityListBase: {
            searchPlaceholder: "Search something",
            searchTooLong: "Your search query is too long. Please use 100 characters or fewer."
          },
          entityForm: {
            languages: "Languages",
            delete: "Delete",
            viewInApp: "View in app",
            submit: "Submit",
            mainImage: "Main image",
            new: "New",
            formActions: "Form Actions"
          },
          locationPickerSection: {
            updateLocation: "Update location",
            clearLocation: "Clear location",
            selectedCoordinates: "Selected coordinates: ",
            location: "Location",
            addLocation: "Add location",
            confirmLocation: "Confirm location",
            noLocationSet: "No location set",
            selectLocation: "Select location from the map"
          },
          entitySearchSelector: {
            selectArtist: "Select an artist",
            clearArtist: "Clear artist",
            searchArtist: "Search for an artist",
            selectExhibition: "Select an exhibition",
            clearExhibition: "Clear exhibition",
            searchExhibition: "Search for an exhibition",
            selectArtwork: "Select an artwork",
            clearArtwork: "Clear artwork",
            searchArtwork: "Search an artwork"
          },
          multiEntitySearchSelector: {
            selectGenre: "Select a genre"
          },
          contactInformationSection: {
            contactInformation: "Contact information",
            selectPlatform: "Select platform",
            add: "Add"
          },
          imageDescriptionsSection: {
            imageDescriptionsSection: "Image Descriptions",
            addImage: "Add Image"
          },
          notFoundPage: {
            notFound: "Page not found"
          },
          serverErrorPage: {
            serverError: "There was an error on the server, please try again later."
          },
          yours: {
            noEntities: "You haven't added anything yet. Press the button on the lower right corner to add something.",
            loginMessage: "Log in to see your content."
          },
          favorites: {
            noEntities: "You haven't added anything to the favorites yet.",
            loginMessage: "Log in to see your favorites."
          },
          recentlyViewed: {
            noEntities: "You haven't watched anything yet.",
            loginMessage: "Log in to see your history."
          },
          notificationService: {
            title: "Exhibition Reminder",
            bodyPrefix: "Don't forget the",
            bodySuffix: "It starts tomorrow!"
          }
          
        },
      },
      ro: {
        translation: {
          shared: {
            artwork: "Lucrare de artă",
            exhibition: "Expoziție",
            artist: "Artist",
            artworkDetail: "Detaliu de lucrare",
            genre: "Gen",
            favorites: "Favorite",
            profile: "Profil",
            logIn: "Autentificare",
            settings: "Setări",
            information: "Informații",
            loadMore: "Mai multe",
            maps: "Hartă",
            artworks: "Lucrări de artă",
            genres: "Genuri",
            exhibitions: "Expoziții",
            artworkDetails: "Detalii relevante a lucrărilor",
            artists: "Artiști",
            dimensions: "Dimensiuni",
            noResults: "Nu sunt rezultate",
            dateOfBirth: "Data de naștere",
            dateOfDeath: "Data de deces",
            phoneNumber: "Număr de telefon",
            email: "Adresă de email",
            webpage: "Pagină web",
            socialMedia: "Social media",
            name: "Nume",
            description: "Descriere",
            medium: "Mediu",
            nonStop: "Non stop",
            startTime: "Început",
            endTime: "Sfârșit",
            monday: "Luni",
            tuesday: "Marți",
            wednesday: "Miercuri",
            thursday: "Joi",
            friday: "Vineri",
            saturday: "Sâmbătă",
            sunday: "Duminică",
            remove: "Șterge",
            yours: "Conținutul tău",
            home: "Acasă",
            address: "Adresa",
            tooltip: {
              languages: "Poți adăuga conținut în mai multe limbi. Textul va apărea în limba preferată a utilizatorului"
            },
            recentlyViewed: "Vizualizate recent",
          },
          startPage: {
            title: "Pagina de pornire",
            welcomeText: "Totul despre artă!",
            startPageButtonText: "Începe",
          },
          userProfile: {
            youAreAGuest: "Ești vizitator",
            logOut: "Deconectare",
            account: "Cont",
          },
          authForm: {
            signUp: "Înregistrare",
            continueWith: "Continuare cu",
            authentication: "Autentificare",
          },
          chatBot: {
            startConversation: "Începe conversația",
            askAi: "Întreabă un AI",
            suggestedQuestions:  [
              "Care sunt conceptele principale?",
              "Ce vrea să spună artistul?",
              "Spune mai multe",
            ],
          },
          userModeSelection: {
            continueAsGuest: "Continuă ca vizitator",
            userSelection: "Selectarea Utilizatorului",
          },
          description: {
            readMore: "Mai multe...",
            readLess: "Mai puține",
          },
          settings: {
            theme: "Temă",
            language: "Limbă",
          },
          languageSettings: {
            languageNames: {
              en: "English",
              ro: "Romanian",
            },
          },
          themeSettings: {
            themeNames: {
              light: "Deschis",
              dark: "Închis",
            },
          },
          entityNotFound: {
            notFoundArtwork: "Lucrarea de artă nu poate fi găsită",
            notFoundArtist: "Artistul nu poate fi găsit",
            notFoundExhibition: "Expoziția nu poate fi găsită",
            notFoundArtworkDetail: "Detaliul lucrării de artă nu poate fi găsit",
            notFoundGenre: "Genul nu poate fi găsit",
          },
          markerWithInfoWindow: {
            findOutMore: "Află mai multe",
          },
          maps: {
            lookAroundTheMap: "Uită-te pe hartă pentru expoziții",
          },
          camera: {
            scanAQR: "Scanează un QR",
            permissionsErrorUserDeniedCameraAccess: "Permite folosirea camerei pentru a continua.",
            pleaseWait: "Așteaptă...",
            cameraNotSupported: "Camera nu este suportată pe acest dispozitiv",
            camera: "Camera",
          },
          artworkPage: {
            medium: "Mediu",
            dimensions: "Dimensiuni",
            artworkFoundAt: "Această lucrare poate fi găsită la",
            otherArtworksBy: "Alte lucrări de la",
            detailsOfTheArtwork: "Detalii ale lucrării de artă",
            otherArtworksFrom: "Alte lucrări la",
            analyzeArtworkUsingAI: "Analizează lucrarea folosind AI"
          },
          artworkDetailPage: {
            detailBelongsToArtwork: "Acest detaliu aparține lucrării:",
            otherDetails: "Alte detalii ale lucrării:",
          },
          artistPage: {
            artworksFromArtist: "Lucrările acestui artist",
          },
          exhibitionPage: {
            artworksFromExhibition: "Lucrări de la această expoziție",
            schedule: "Program",
          },
          genrePage: {
            artworksOfThisGenre: "Lucrări de artă de acest gen",
          },
          artworkForm: {
            dimensionsPlaceholder: "de ex. 77 cm x 53 cm",
            generating: "Se generează",
            generateQR: "Generează codul QR",
            searchArtist: "Caută un artist",
            tooltip: {
              dimensions: "Dimensiunile lucrării de artă. Pentru picturi, furnizează atât lățimea cât și înălțimea împreună cu unitatea (de ex., '77 cm x 53 cm').",
              genres: "Genurile lucrării de artă. Aceasta poate avea mai multe genuri simultan.",
              mainImage: "Este afișată în partea de sus a paginii. Alege o imagine care reprezintă clar lucrarea de artă.",
              location: "Selectează o locație pe hartă, dacă este relevant (util pentru lucrări precum statuile).",
              exhibition: "Expoziția în care este expusă lucrarea de artă.",
              artist: "Artistul care a creat lucrarea de artă.",
              name: "Numele lucrării de artă.",
              description: "O descriere a lucrării de artă. Poți folosi simboluri markdown simple (de ex., * pentru accentuare, _ pentru italic și # pentru titluri) pentru a formata textul.",
              medium: "Mediul utilizat (de ex., ulei sau acuarelă pentru picturi)."
            }
          },
          artworkDetailForm: {
            tooltip: {
              mainImage: "Este afișată în partea de sus a paginii. Alege o imagine care reprezintă clar detaliul specific al lucrării de artă.",
              artwork: "Lucrarea de artă căreia îi aparține acest detaliu.",
              name: "Numele detaliului lucrării de artă (de ex., privirea Monna Lisei).",
              description: "O descriere a detaliului lucrării de artă. Poți folosi simboluri markdown simple (de ex., * pentru accentuare, _ pentru italic și # pentru titluri) pentru a formata textul."
            }
          },
          artistForm: {
            tooltip: {
              genres: "Genurile în care activează artistul.",
              mainImage: "Este afișată în partea de sus a paginii. Alege o imagine care reprezintă clar artistul, cum ar fi un portret.",
              name: "Numele artistului (de ex., Leonardo Da Vinci).",
              description: "O descriere a artistului. Poți folosi simboluri markdown simple (de ex., * pentru accentuare și # pentru titluri) pentru a formata textul.",
              contactInformation: "Informații de contact pentru artist. Util pentru artiștii contemporani, cu care oamenii ar putea dori să ia legătura.",
              socialMedia: "Conturile de social media ale artistului. Util pentru artiștii contemporani, cu care oamenii ar putea dori să ia legătura.",
              imageDescriptions: "Furnizează imagini suplimentare care reprezintă artistul. De asemenea, poți adăuga o descriere pentru fiecare imagine."
            }
          },
          exhibitionForm: {
            date: "Data",
            noSchedule: "Fără program",
            fixedSchedule: "Program fix",
            customSchedule: "Program customizat",
            tooltip: {
              genres: "Genurile lucrărilor de artă prezente la expoziție.",
              mainImage: "Este afișată în partea de sus a paginii. Alege o imagine care reprezintă clar expoziția, cum ar fi o imagine a interiorului.",
              name: "Numele expoziției (de ex., Expoziție de artă clasică).",
              description: "O descriere a expoziției. Poți folosi simboluri markdown simple (de ex., * pentru accentuare, _ pentru italic și # pentru titluri) pentru a formata textul.",
              address: "Adresa expoziției.",
              contactInformation: "Informații de contact pentru expoziție.",
              socialMedia: "Linkuri de social media pentru expoziție.",
              location: "Selectează locația expoziției pe hartă.",
              imageDescriptions: "Furnizează imagini suplimentare care reprezintă expoziția. De asemenea, poți adăuga o descriere pentru fiecare imagine.",
              schedule: "Programul expoziției.",
              fixedSchedule: "Anumite zile ale săptămânii (de ex., Luni-Vineri, 8:00 - 18:00).",
              customSchedule: "Expoziția este un eveniment unic care se desfășoară în date specifice (de ex., 5-6 aprilie 2025)."
            }
          },
          genreForm: {
            tooltip: {
              mainImage: "Este afișată în partea de sus a paginii. Alege o imagine care reprezintă clar genul, cum ar fi o lucrare de artă celebră din acest gen.",
              name: "Numele genului (de ex., Renaștere).",
              description: "O descriere a genului. Poți folosi simboluri markdown simple (de ex., * pentru accentuare, _ pentru italic și # pentru titluri) pentru a formata textul.",
              imageDescriptions: "Furnizează imagini suplimentare care reprezintă genul. De asemenea, poți adăuga o descriere pentru fiecare imagine."
            }
          },
          gallerySection: {
            gallery: "Galerie",
          },
          modal: {
            cancel: "Gata",
          },
          entityListBase: {
            searchPlaceholder: "Caută ceva",
            searchTooLong: "Căutarea este prea lungă, folosește 100 de caractere sau mai puțin."
          },
          entityForm: {
            languages: "Limbi",
            delete: "Șterge",
            viewInApp: "Vizualizează în aplicație",
            submit: "Trimite",
            mainImage: "Poza principală",
            new: "Nou",
            formActions: "Acțiuni de formular"
          },
          locationPickerSection: {
            updateLocation: "Actualizează locația",
            clearLocation: "Șterge locația",
            selectedCoordinates: "Coordonate selectate: ",
            location: "Locație",
            addLocation: "Adaugă locație",
            confirmLocation: "Confirmă locația",
            noLocationSet: "Locația nu este specificată.",
            selectLocation: "Alege o locație de pe hartă",
          },
          entitySearchSelector: {
            selectArtist: "Seletează un artist",
            clearArtist: "Șterge artistul",
            searchArtist: "Caută un artist",
            selectExhibition: "Seletează o expoziție",
            clearExhibition: "Șterge expoziția",
            searchExhibition: "Caută o expoziție",
            selectArtwork: "Seletează o lucrare",
            clearArtwork: "Șterge lucrarea",
            searchArtwork: "Caută o lucrare"
          },
          multiEntitySearchSelector: {
            selectGenre: "Seletează un gen"
          },
          contactInformationSection: {
            contactInformation: "Informații de contact",
            selectPlatform: "Alege o platformă",
            add: "Adaugă"
          },
          imageDescriptionsSection: {
            imageDescriptionsSection: "Poze cu descrieri",
            addImage: "Adaugă poză"
          },
          notFoundPage: {
            notFound: "Pagina nu poate fi găsită"
          },
          serverErrorPage: {
            serverError: "A apărut o eroare pe server, vă rugăm să încercați din nou mai târziu."
          },
          yours: {
            noEntities: "Nu ai adăugat încă nimic. Apasă buton din dreapta jos pentru a adăuga ceva.",
            loginMessage: "Loghează-te pentru a vedea conținutul tău."
          },
          favorites: {
            noEntities: "Nu ai adăugat încă nimic la favorite.",
            loginMessage: "Loghează-te pentru a vedea favoritele."
          },
          recentlyViewed: {
            noEntities: "Nu ai vizualizat încă nimic.",
            loginMessage: "Loghează-te pentru a vedea istoricul."
          },
          notificationService: {
            title: "Nu uita expoziția",
            bodyPrefix: "Nu uita de",
            bodySuffix: "Va începe mâine!"
          }
        },
      },
    },
    fallbackLng: "en",
  });

export const supportedLanguages = Object.keys(i18n.options.resources ?? {});

export default i18n;
