# MVP návrh iOS aplikácie: inteligentný organizér fotoknižnice

## Produktová vízia

Aplikácia je inteligentná vrstva nad existujúcou Apple Photos knižnicou. Nenahrádza aplikáciu Fotky, ale pomáha používateľovi rýchlo nájsť duplicity, podobné zábery, nekvalitné fotografie, staré screenshoty, dokumenty a veľké videá. Všetky analýzy v MVP prebiehajú lokálne na zariadení a mazanie je vždy manuálne potvrdené používateľom.

## MVP rozsah

### Musí byť v prvej verzii

1. **Import a indexovanie knižnice**
   - čítanie assetov cez Photos Framework,
   - rozlíšenie fotiek, videí, Live Photos, screenshotov a dokumentovo pôsobiacich fotiek,
   - priebežný background index s možnosťou pauzy.

2. **Dashboard úspory miesta**
   - počet fotiek a videí,
   - odhad obsadeného miesta,
   - počet nájdených duplicít,
   - počet podobných skupín,
   - rozmazané fotky,
   - najväčšie videá,
   - staré screenshoty,
   - odhad potenciálnej úspory.

3. **Presné duplicity a veľmi podobné fotky**
   - perceptuálny hash pre obrázky,
   - zoskupovanie podľa podobnosti,
   - odporúčanie najlepšej verzie podľa kvality, rozlíšenia, obľúbenosti a metadát.

4. **Základné hodnotenie kvality**
   - ostrosť,
   - rozmazanie,
   - expozícia,
   - tváre so zavretými očami, ak ich Vision spoľahlivo rozpozná,
   - jednoduché celkové skóre.

5. **Screenshoty a dokumenty**
   - detekcia screenshotov podľa `PHAssetMediaSubtype.photoScreenshot`,
   - OCR cez Vision,
   - základné kategórie: potvrdenia, QR kódy, mapy, konverzácie, web stránky, recepty, pracovné screenshoty a náhodné screenshoty.

6. **Vyhľadávanie**
   - lokálne full-text vyhľadávanie nad OCR textom,
   - filtrovanie podľa kategórie, dátumu, typu média a skóre kvality.

7. **Bezpečné mazanie**
   - aplikácia nikdy nemaže automaticky,
   - návrhy na odstránenie idú do review obrazovky,
   - používateľ manuálne potvrdí konkrétne položky,
   - mazanie cez Photos Framework s natívnym systémovým potvrdením.

### Odložiť po MVP

- plnohodnotný konverzačný AI asistent,
- pokročilé vlastné Core ML modely pre psa, auto, jedlo a dizajn,
- automatické pomenovanie inteligentných albumov podľa osobných tém,
- cloudová synchronizácia výsledkov medzi zariadeniami,
- veľmi presná estetická klasifikácia fotiek pomocou väčších modelov.

## Technická architektúra

### Platforma

- SwiftUI,
- iOS 18+,
- MVVM,
- Photos Framework,
- Vision Framework,
- VisionKit pre dokumentové UX tam, kde dáva zmysel,
- Core ML pre lokálne klasifikátory,
- SwiftData alebo SQLite pre index,
- BackgroundTasks pre dlhšie indexovanie,
- PhotoKit change observer pre aktualizáciu indexu pri zmenách v knižnici.

### Vrstvy aplikácie

1. **Presentation layer**
   - SwiftUI obrazovky,
   - ViewModels,
   - navigácia,
   - výber a hromadné akcie.

2. **Domain layer**
   - pravidlá pre duplikáty,
   - výpočet kvality,
   - kategorizácia,
   - odporúčací algoritmus,
   - bezpečnostné pravidlá mazania.

3. **Data layer**
   - PhotoLibraryRepository nad Photos Frameworkom,
   - lokálny index analyzovaných assetov,
   - OCR index,
   - cache thumbnailov a embeddingov/hashov.

4. **Analysis layer**
   - DuplicateDetector,
   - SimilarityAnalyzer,
   - QualityAnalyzer,
   - ScreenshotClassifier,
   - DocumentOCRAnalyzer,
   - VideoAnalyzer.

## Navrhovaný dátový model

### PhotoAssetIndex

- `localIdentifier: String`
- `mediaType: MediaType`
- `subtypes: [AssetSubtype]`
- `creationDate: Date?`
- `modificationDate: Date?`
- `pixelWidth: Int`
- `pixelHeight: Int`
- `duration: TimeInterval?`
- `estimatedFileSize: Int64?`
- `isFavorite: Bool`
- `isHidden: Bool`
- `isScreenshot: Bool`
- `isLivePhoto: Bool`
- `analysisStatus: AnalysisStatus`

### VisualAnalysisResult

- `assetId: String`
- `perceptualHash: String?`
- `featureVectorId: String?`
- `sharpnessScore: Double`
- `blurScore: Double`
- `exposureScore: Double`
- `compositionScore: Double`
- `faceScore: Double?`
- `overallQualityScore: Double`
- `analyzedAt: Date`

### OCRResult

- `assetId: String`
- `recognizedText: String`
- `languageHints: [String]`
- `textConfidence: Double`
- `detectedDocumentType: DocumentType?`
- `containsQRCode: Bool`

### SuggestionGroup

- `id: UUID`
- `type: SuggestionType`
- `title: String`
- `assetIds: [String]`
- `recommendedKeepIds: [String]`
- `recommendedDeleteIds: [String]`
- `estimatedSavings: Int64`
- `confidence: Double`
- `createdAt: Date`
- `userDecision: UserDecision?`

### SmartCategory

- `id: UUID`
- `name: String`
- `categoryType: CategoryType`
- `assetIds: [String]`
- `confidence: Double`
- `lastUpdatedAt: Date`

## Hlavné obrazovky

1. **Onboarding a súkromie**
   - vysvetlenie, že fotky neopúšťajú zariadenie,
   - žiadosť o Photos permission,
   - voľba: analyzovať celú knižnicu alebo najprv posledných 12 mesiacov.

2. **Dashboard**
   - veľká karta „Možná úspora“,
   - stav indexovania,
   - karty: Duplicity, Podobné, Rozmazané, Screenshoty, Dokumenty, Najväčšie videá.

3. **Review skupiny duplicít**
   - veľké náhľady,
   - odporúčaná fotka na ponechanie,
   - dôvod odporúčania,
   - rýchle tlačidlá „ponechať najlepšiu“, „označiť všetky okrem najlepšej“, „preskočiť“.

4. **Podobné fotky**
   - skupiny scén,
   - top 1 až 2 odporúčané fotky,
   - kvalitatívne štítky: ostrá, rozmazaná, najvyššie rozlíšenie, obľúbená.

5. **Screenshoty**
   - segmenty podľa kategórie,
   - staré screenshoty,
   - OCR vyhľadávanie,
   - hromadné označovanie.

6. **Dokumenty**
   - faktúry, bločky, zmluvy, vizitky, doklady,
   - vyhľadávanie podľa textu,
   - filter podľa dátumu.

7. **Vyhľadávanie / AI asistent Lite**
   - textové vyhľadávanie podporujúce preddefinované zámery,
   - príklady: „rozmazané fotky“, „faktúry“, „pes“, „jedlo“, „podobné fotky“.

8. **Bezpečné odstránenie**
   - finálny zoznam označených položiek,
   - odhad úspory,
   - upozornenie, že odstránenie prebehne cez Apple Photos,
   - potvrdenie používateľom.

## Používateľský flow

1. Používateľ otvorí aplikáciu.
2. Aplikácia vysvetlí lokálne spracovanie a požiada o prístup ku knižnici.
3. Používateľ spustí prvý scan.
4. Dashboard priebežne ukazuje výsledky už počas indexovania.
5. Používateľ otvorí „Duplicity“ alebo „Podobné fotky“.
6. Aplikácia ukáže skupiny a odporúčania.
7. Používateľ manuálne označí položky na odstránenie.
8. Pred odstránením vidí súhrn a odhad ušetreného miesta.
9. Používateľ potvrdí systémový Photos delete dialog.
10. Index sa aktualizuje po zmene knižnice.

## Algoritmy pre MVP

### Duplicity

- najprv zoskupiť assety podľa veľkosti, rozlíšenia, dátumu a trvania,
- pre kandidátov vytvoriť perceptuálny hash zo zmenšeného náhľadu,
- identické alebo takmer identické hashe zlúčiť do skupín,
- odporučiť ponechanie podľa:
  - najvyššie rozlíšenie,
  - najvyššia ostrosť,
  - najnižšie rozmazanie,
  - obľúbená fotka má prioritu,
  - editovaná verzia môže mať prioritu pred originálom,
  - Live Photo má prioritu pred statickou kópiou, ak je inak podobná.

### Podobné fotky

- zoskupiť fotky podľa dátumu a lokality, ak je dostupná,
- porovnať vizuálny hash alebo Vision feature print,
- vytvoriť skupiny podobných scén,
- vybrať 1 až 2 najlepšie podľa kvality a rozmanitosti.

### Kvalita

- ostrosť odhadnúť lokálnou analýzou kontrastu hrán,
- rozmazanie odhadnúť cez Laplacian variance alebo podobný lokálny metrický výpočet,
- expozíciu odhadnúť z histogramu,
- tváre a oči analyzovať cez Vision face landmarks,
- výsledok normalizovať na skóre 0 až 100.

### Screenshoty a dokumenty

- screenshoty identifikovať PhotoKit subtype,
- OCR text analyzovať pravidlami a ľahkým lokálnym klasifikátorom,
- QR kódy detegovať Vision barcode requestom,
- kategórie určovať kombináciou OCR kľúčových slov, layoutu a vizuálnych znakov.

## Vývojový plán krok za krokom

### Fáza 1: Základ projektu

1. Vytvoriť SwiftUI projekt pre iOS 18+.
2. Nastaviť MVVM štruktúru.
3. Pridať Photos permission texty do `Info.plist`.
4. Implementovať PhotoLibraryRepository.
5. Zobraziť grid assetov podobný Apple Photos.

### Fáza 2: Lokálny index

1. Navrhnúť SwiftData alebo SQLite schému.
2. Uložiť základné metadáta assetov.
3. Pridať PhotoKit change observer.
4. Pridať background scan queue.
5. Pridať stav indexovania do dashboardu.

### Fáza 3: Duplicity

1. Generovať thumbnails pre analýzu.
2. Implementovať perceptuálny hash.
3. Zoskupiť presné a takmer presné duplicity.
4. Vytvoriť review obrazovku.
5. Pridať odporúčanie najlepšej verzie.

### Fáza 4: Kvalita a podobnosť

1. Implementovať sharpness, blur a exposure scoring.
2. Pridať Vision face detection.
3. Pridať Vision feature print alebo alternatívny lokálny similarity descriptor.
4. Vytvoriť podobné skupiny.
5. Zobraziť dôvody odporúčania pri každej fotke.

### Fáza 5: Screenshoty, OCR a dokumenty

1. Detegovať screenshoty cez Photos Framework.
2. Spustiť Vision OCR nad screenshotmi a dokumentovými fotkami.
3. Uložiť OCR text do lokálneho indexu.
4. Implementovať kategorizáciu screenshotov.
5. Pridať full-text vyhľadávanie.

### Fáza 6: Bezpečné mazanie

1. Zaviesť `DeletionReviewView`.
2. Pridať košík návrhov na odstránenie.
3. Vyžadovať manuálne potvrdenie.
4. Zavolať Photos Framework delete API.
5. Aktualizovať index po úspešnej zmene.

### Fáza 7: Optimalizácia pre veľké knižnice

1. Spracovávať assety po dávkach.
2. Prioritizovať najnovšie a najväčšie položky.
3. Cacheovať výsledky analýzy.
4. Obmedziť paralelizmus podľa batérie a teploty zariadenia.
5. Použiť incremental scan namiesto opakovanej úplnej analýzy.

## Riziká a odporúčania

- Photos Framework nemusí vždy poskytnúť presnú veľkosť súboru jednoducho a lacno; MVP môže používať odhad a presnejší výpočet spúšťať iba pre kandidátov na mazanie.
- Veľké knižnice môžu vyžadovať viacero behov indexovania, preto musí byť scan obnoviteľný.
- Zavreté oči a výraz tváre môžu byť nespoľahlivé bez vlastného modelu, preto ich treba označiť ako pomocné signály, nie definitívny verdikt.
- Aplikácia by mala jasne komunikovať, že návrhy sú odporúčania, nie automatické rozhodnutia.

## Definícia hotového MVP

MVP je hotové, keď používateľ vie:

- povoliť prístup ku knižnici,
- spustiť lokálnu analýzu,
- vidieť dashboard s potenciálnou úsporou,
- prezerať skupiny duplicít a podobných fotiek,
- nájsť rozmazané fotky,
- filtrovať screenshoty a dokumenty podľa OCR textu,
- manuálne potvrdiť odstránenie vybraných položiek,
- používať aplikáciu bez toho, aby fotky opustili zariadenie.
