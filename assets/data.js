/* Mostova Staffing — demo data. Fictional company, sample values only. */
window.MOSTOVA = {
  today: "2026-10-17",
  cities: {
    lodz: { en: "Łódź", uk: "Лодзь" },
    poznan: { en: "Poznań", uk: "Познань" },
    kutno: { en: "Kutno", uk: "Кутно" },
    wrzesnia: { en: "Września", uk: "Вжесня" },
    konin: { en: "Konin", uk: "Конін" },
    lowicz: { en: "Łowicz", uk: "Лович" }
  },
  sectors: {
    meat: {
      en: "Meat processing", uk: "М’ясопереробка",
      need: [
        { en: "A document that lets you work in Poland|Passport with a visa or residence card. We help with the work permit.", uk: "Документ, що дає право працювати в Польщі|Паспорт із візою або карта побиту. З дозволом на роботу допоможемо." },
        { en: "Sanitary-epidemiological booklet|No booklet yet? We book the tests and cover the cost after one month.", uk: "Санітарна книжка|Ще немає? Запишемо на аналізи, а вартість повернемо після першого місяця." },
        { en: "Comfort working in a cool hall|Around +2 to +8 °C. Warm workwear is provided.", uk: "Готовність працювати в прохолодному цеху|Близько +2…+8 °C. Теплий робочий одяг видаємо." }
      ],
      get: [
        { en: "Workwear, boots and knife-proof gloves|Issued on day one, replaced free when worn out.", uk: "Робочий одяг, взуття та захисні рукавиці|Видаємо в перший день, зношене міняємо безкоштовно." },
        { en: "Pay every month by the 10th|Advance of up to 500 PLN after your first week.", uk: "Зарплата щомісяця до 10 числа|Аванс до 500 зл після першого тижня." },
        { en: "Subsidised canteen|Hot lunch for 8 PLN on every shift.", uk: "Їдальня зі знижкою|Гарячий обід за 8 зл на кожній зміні." }
      ]
    },
    dairy: {
      en: "Dairy", uk: "Молочне виробництво",
      need: [
        { en: "A document that lets you work in Poland|Passport with a visa or residence card. We help with the work permit.", uk: "Документ, що дає право працювати в Польщі|Паспорт із візою або карта побиту. З дозволом на роботу допоможемо." },
        { en: "Sanitary-epidemiological booklet|We arrange the tests if you do not have one.", uk: "Санітарна книжка|Якщо її немає, організуємо аналізи." },
        { en: "Care with hygiene rules|Hairnet, no jewellery, hand washing at every entry.", uk: "Дотримання правил гігієни|Сітка для волосся, без прикрас, миття рук на вході." }
      ],
      get: [
        { en: "Contract from the first day|Health insurance and pension contributions paid.", uk: "Договір з першого дня|Медичне страхування та пенсійні внески сплачуються." },
        { en: "Overtime paid at +50 %|Optional, announced a week ahead.", uk: "Понаднормові з доплатою 50 %|За бажанням, графік відомий за тиждень." },
        { en: "Dairy products allowance|A monthly pack from the plant shop.", uk: "Молочна продукція від заводу|Щомісячний набір із фірмової крамниці." }
      ]
    },
    bakery: {
      en: "Bakery", uk: "Пекарня",
      need: [
        { en: "A document that lets you work in Poland|Passport with a visa or residence card. We help with the work permit.", uk: "Документ, що дає право працювати в Польщі|Паспорт із візою або карта побиту. З дозволом на роботу допоможемо." },
        { en: "Sanitary-epidemiological booklet|We arrange the tests if you do not have one.", uk: "Санітарна книжка|Якщо її немає, організуємо аналізи." },
        { en: "Steady pace in a warm hall|Ovens keep the hall at +24 to +32 °C. Water and breaks every two hours.", uk: "Стійкий темп у теплому цеху|Біля печей +24…+32 °C. Вода й перерви кожні дві години." }
      ],
      get: [
        { en: "Light, breathable workwear|Changed and washed by the plant.", uk: "Легкий робочий одяг|Прання та заміна за рахунок заводу." },
        { en: "Pay every month by the 10th|Advance of up to 500 PLN after your first week.", uk: "Зарплата щомісяця до 10 числа|Аванс до 500 зл після першого тижня." },
        { en: "Fresh bread every shift|Take-home pack from the day’s production.", uk: "Свіжий хліб щозміни|Набір із денної випічки додому." }
      ]
    },
    cold: {
      en: "Cold storage", uk: "Холодильні склади",
      need: [
        { en: "A document that lets you work in Poland|Passport with a visa or residence card. We help with the work permit.", uk: "Документ, що дає право працювати в Польщі|Паспорт із візою або карта побиту. З дозволом на роботу допоможемо." },
        { en: "Health to work in the cold|Confirmed by an occupational medicine check, paid by us.", uk: "Здоров’я для роботи в холоді|Підтверджує медогляд, який оплачуємо ми." },
        { en: "Two days of paid training|Scanner, safety rules and freezer rotations.", uk: "Два дні оплачуваного навчання|Сканер, техніка безпеки, ротації в морозильній камері." }
      ],
      get: [
        { en: "Freezer bonus included in the range|Paid on top of the legal night supplement.", uk: "Доплата за холод уже в ставці|Окремо від нічної доплати, передбаченої законом." },
        { en: "Thermal suit, boots and gloves|Issued on day one, replaced free when worn out.", uk: "Термокостюм, взуття та рукавиці|Видаємо в перший день, зношене міняємо безкоштовно." },
        { en: "Warm breaks every 50 minutes|10 minutes in a heated room with hot drinks.", uk: "Теплі перерви кожні 50 хвилин|10 хвилин в опалюваній кімнаті з гарячими напоями." }
      ]
    },
    packing: {
      en: "Packing", uk: "Пакування",
      need: [
        { en: "A document that lets you work in Poland|Passport with a visa or residence card. We help with the work permit.", uk: "Документ, що дає право працювати в Польщі|Паспорт із візою або карта побиту. З дозволом на роботу допоможемо." },
        { en: "Attention to detail|Labels, weights and dates are checked on every box.", uk: "Уважність|На кожній коробці перевіряють етикетку, вагу й дату." },
        { en: "Standing work for the shift|Short breaks every two hours, 30-minute meal break.", uk: "Робота стоячи протягом зміни|Короткі перерви кожні дві години, 30 хвилин на обід." }
      ],
      get: [
        { en: "Simple start, no experience needed|A team leader shows you the line on day one.", uk: "Легкий старт без досвіду|Бригадир покаже лінію в перший день." },
        { en: "Pay every month by the 10th|Advance of up to 500 PLN after your first week.", uk: "Зарплата щомісяця до 10 числа|Аванс до 500 зл після першого тижня." },
        { en: "Attendance bonus|200 PLN a month with no missed shifts.", uk: "Бонус за відвідуваність|200 зл на місяць без пропущених змін." }
      ]
    }
  },
  /* shift: [start hour, end hour]; type: morning | afternoon | night | long
     contract: temp (temporary work) | emp (employment) | mandate (civil-law mandate)
     langs: languages spoken at work; rent: PLN/month or null when housing is not offered */
  jobs: [
    { id: "j01", city: "lodz", district: "Olechów", sector: "cold", temp: -18, shift: [22, 6], type: "night", days: "4on3off", contract: "temp", rent: 450, noExp: true, langs: ["uk", "pl"], pay: [30, 34], urgent: true, posted: "2026-10-15", closes: "2026-11-15", places: 12,
      en: { title: "Freezer picker, night shift", desc: "Pick frozen goods with a hand scanner, build pallets for supermarket orders and wrap them for loading. You work in 50-minute rotations with 10-minute warm breaks, led by a team leader who speaks Ukrainian and Polish." },
      uk: { title: "Комплектувальник у морозильній камері, нічна зміна", desc: "Збираєте заморожені товари зі сканером, формуєте палети під замовлення супермаркетів і обмотуєте їх плівкою. Працюєте ротаціями по 50 хвилин із 10-хвилинними теплими перервами; бригадир говорить українською та польською." } },
    { id: "j02", city: "kutno", district: "Sklęczki", sector: "meat", temp: 2, shift: [6, 14], type: "morning", days: "monfri", contract: "temp", rent: 480, noExp: true, langs: ["uk", "pl", "ru"], pay: [27, 31], urgent: true, posted: "2026-10-16", closes: "2026-11-20", places: 8,
      en: { title: "Meat packer", desc: "Pack cuts into trays, weigh and label them, and stack crates for the cold room. A calm morning line with fixed weekends." },
      uk: { title: "Пакувальник м’яса", desc: "Розкладаєте нарізку в лотки, зважуєте, маркуєте й складаєте ящики для холодильної камери. Спокійна ранкова лінія, вихідні фіксовані." } },
    { id: "j03", city: "wrzesnia", district: "Strefa Przemysłowa", sector: "bakery", temp: 28, shift: [14, 22], type: "afternoon", days: "monsat", contract: "mandate", rent: null, noExp: true, langs: ["pl", "uk"], pay: [25, 28], urgent: true, posted: "2026-10-14", closes: "2026-11-10", places: 6,
      en: { title: "Bakery line helper", desc: "Feed dough onto the line, take trays from the cooling spiral and pack rolls for supermarket chains. Good for a first job in Poland." },
      uk: { title: "Помічник на лінії пекарні", desc: "Подаєте тісто на лінію, знімаєте лотки зі спірального охолоджувача й пакуєте булочки для мереж супермаркетів. Підходить як перша робота в Польщі." } },
    { id: "j04", city: "poznan", district: "Franowo", sector: "dairy", temp: 6, shift: [6, 18], type: "long", days: "2on2off", contract: "emp", rent: 520, noExp: false, langs: ["pl", "en"], pay: [28, 32], urgent: true, posted: "2026-10-13", closes: "2026-11-30", places: 4,
      en: { title: "Dairy filling operator", desc: "Run a yoghurt filling machine: change rolls of foil, check seal quality and log batches. Twelve-hour shifts, two on and two off, so you get long breaks." },
      uk: { title: "Оператор розливу на молочному заводі", desc: "Обслуговуєте машину розливу йогуртів: міняєте рулони фольги, перевіряєте запайку, ведете облік партій. Зміни по 12 годин, два через два — довгий відпочинок." } },
    { id: "j05", city: "konin", district: "Morzysław", sector: "meat", temp: 4, shift: [6, 14], type: "morning", days: "monfri", contract: "emp", rent: 450, noExp: false, langs: ["pl", "uk"], pay: [32, 38], urgent: false, posted: "2026-10-09", closes: "2026-12-01", places: 5,
      en: { title: "Deboner", desc: "Debone pork shoulders and hams to plant specification. You need at least one year of knife work; output above norm is paid as a bonus." },
      uk: { title: "Обвалювальник", desc: "Обвалюєте свинячу лопатку та окіст за стандартом заводу. Потрібен щонайменше рік досвіду роботи з ножем; перевиконання норми оплачується премією." } },
    { id: "j06", city: "poznan", district: "Antoninek", sector: "cold", temp: -24, shift: [6, 18], type: "long", days: "2on2off", contract: "emp", rent: 600, noExp: false, langs: ["pl", "en"], pay: [33, 38], urgent: false, posted: "2026-10-08", closes: "2026-11-25", places: 3,
      en: { title: "Reach truck operator, freezer", desc: "Move pallets to high racks in a −24 °C store. You need a UDT reach truck licence and a year of warehouse driving." },
      uk: { title: "Оператор ричтрака в морозильному складі", desc: "Розміщуєте палети на високих стелажах у складі з температурою −24 °C. Потрібні посвідчення UDT на ричтрак і рік досвіду на складі." } },
    { id: "j07", city: "lodz", district: "Widzew", sector: "packing", temp: 4, shift: [14, 22], type: "afternoon", days: "monfri", contract: "temp", rent: 450, noExp: true, langs: ["uk", "pl", "ru"], pay: [26, 29], urgent: false, posted: "2026-10-12", closes: "2026-11-30", places: 10,
      en: { title: "Packing operator, ready meals", desc: "Seal and label ready meals, check weights and build mixed pallets for delivery. Bus from the Widzew hostel for every shift." },
      uk: { title: "Оператор пакування готових страв", desc: "Запаюєте й маркуєте готові страви, перевіряєте вагу та збираєте змішані палети на відвантаження. Автобус від гуртожитку на Відзеві на кожну зміну." } },
    { id: "j08", city: "lowicz", district: "Blich", sector: "bakery", temp: 30, shift: [22, 6], type: "night", days: "monfri", contract: "emp", rent: 400, noExp: false, langs: ["pl"], pay: [29, 33], urgent: false, posted: "2026-10-05", closes: "2026-11-28", places: 2,
      en: { title: "Oven operator", desc: "Load and unload tunnel ovens, watch baking curves and keep the oven log. Night shift with the legal 20 % night supplement on top." },
      uk: { title: "Оператор печі", desc: "Завантажуєте й розвантажуєте тунельні печі, стежите за режимом випікання та ведете журнал. Нічна зміна з доплатою 20 % згідно із законом." } },
    { id: "j09", city: "lowicz", district: "Korabka", sector: "dairy", temp: 8, shift: [6, 14], type: "morning", days: "monfri", contract: "temp", rent: 400, noExp: true, langs: ["pl", "uk"], pay: [26, 30], urgent: false, posted: "2026-10-11", closes: "2026-12-10", places: 6,
      en: { title: "Cheese line operator", desc: "Turn, brine and pack cheese wheels, and help with cleaning the line at shift end. Training on the first two days." },
      uk: { title: "Оператор сирної лінії", desc: "Перевертаєте, солите й пакуєте головки сиру, допомагаєте з миттям лінії наприкінці зміни. Навчання в перші два дні." } },
    { id: "j10", city: "kutno", district: "Wschód", sector: "cold", temp: -18, shift: [14, 22], type: "afternoon", days: "monfri", contract: "temp", rent: 480, noExp: true, langs: ["uk", "pl"], pay: [29, 32], urgent: false, posted: "2026-10-10", closes: "2026-11-30", places: 7,
      en: { title: "Loader, frozen goods", desc: "Load lorries from the freezer dock with an electric pallet truck. Short loading slots with warm breaks in between." },
      uk: { title: "Вантажник заморожених товарів", desc: "Завантажуєте фури з морозильної рампи електровізком. Короткі вікна завантаження з теплими перервами між ними." } },
    { id: "j11", city: "wrzesnia", district: "Centrum", sector: "packing", temp: 12, shift: [6, 14], type: "morning", days: "monfri", contract: "mandate", rent: null, noExp: true, langs: ["pl", "uk"], pay: [24, 26], urgent: false, posted: "2026-09-30", closes: "2026-11-15", places: 8,
      en: { title: "Labelling and packing worker", desc: "Label jars and boxes, pack gift sets and prepare cartons for shipping. Light work in a bright hall." },
      uk: { title: "Працівник маркування й пакування", desc: "Наклеюєте етикетки на банки й коробки, пакуєте подарункові набори та готуєте картони до відправлення. Легка робота у світлому цеху." } },
    { id: "j12", city: "konin", district: "Gosławice", sector: "dairy", temp: 6, shift: [22, 6], type: "night", days: "4on3off", contract: "temp", rent: 450, noExp: true, langs: ["uk", "ru", "pl"], pay: [27, 30], urgent: false, posted: "2026-10-07", closes: "2026-12-05", places: 6,
      en: { title: "Yoghurt palletiser", desc: "Stack yoghurt trays onto pallets, wrap and label them for the morning dispatch. Four nights on, three off." },
      uk: { title: "Палетувальник на виробництві йогуртів", desc: "Складаєте лотки з йогуртами на палети, обмотуєте й маркуєте для ранкового відвантаження. Чотири ночі роботи, три вихідні." } },
    { id: "j13", city: "lodz", district: "Teofilów", sector: "meat", temp: 2, shift: [6, 14], type: "morning", days: "monfri", contract: "emp", rent: 500, noExp: true, langs: ["pl", "uk"], pay: [27, 32], urgent: false, posted: "2026-10-06", closes: "2026-12-15", places: 4,
      en: { title: "Butchery assistant", desc: "Prepare minced meat and marinated portions, keep the station clean and help the deboning team. Pay rises after three months." },
      uk: { title: "Помічник м’ясника", desc: "Готуєте фарш і мариновані порції, тримаєте робоче місце в чистоті, допомагаєте бригаді обвалювальників. Підвищення ставки через три місяці." } },
    { id: "j14", city: "poznan", district: "Starołęka", sector: "meat", temp: 4, shift: [14, 22], type: "afternoon", days: "monfri", contract: "emp", rent: null, noExp: false, langs: ["pl", "en"], pay: [30, 34], urgent: false, posted: "2026-10-04", closes: "2026-11-30", places: 2,
      en: { title: "Quality control helper", desc: "Check temperatures, weights and labels on the line and record results in a tablet. Needs basic Polish or English and attention to detail." },
      uk: { title: "Помічник контролю якості", desc: "Перевіряєте температуру, вагу й етикетки на лінії та вносите результати в планшет. Потрібні базова польська або англійська та уважність." } },
    { id: "j15", city: "poznan", district: "Głuszyna", sector: "bakery", temp: 24, shift: [22, 6], type: "night", days: "monfri", contract: "temp", rent: 560, noExp: true, langs: ["uk", "pl"], pay: [26, 29], urgent: true, posted: "2026-10-16", closes: "2026-11-12", places: 9,
      en: { title: "Bread slicing and packing", desc: "Run slicers, bag loaves and stack crates for early-morning delivery to shops. Night supplement paid on top." },
      uk: { title: "Нарізка та пакування хліба", desc: "Працюєте на слайсерах, пакуєте буханці та складаєте ящики для ранньої доставки в магазини. Нічна доплата окремо." } },
    { id: "j16", city: "konin", district: "Zatorze", sector: "cold", temp: 2, shift: [6, 18], type: "long", days: "2on2off", contract: "temp", rent: 450, noExp: true, langs: ["uk", "pl", "ru"], pay: [27, 30], urgent: false, posted: "2026-10-02", closes: "2026-12-01", places: 8,
      en: { title: "Order picker, chilled warehouse", desc: "Pick dairy and meat orders in a +2 °C warehouse with voice picking. Twelve-hour shifts, two on and two off." },
      uk: { title: "Комплектувальник замовлень, охолоджений склад", desc: "Збираєте замовлення молочки й м’яса на складі з температурою +2 °C за голосовими командами. Зміни по 12 годин, два через два." } },
    { id: "j17", city: "wrzesnia", district: "Gutowo", sector: "meat", temp: 4, shift: [6, 14], type: "morning", days: "monfri", contract: "temp", rent: 420, noExp: true, langs: ["uk", "pl"], pay: [26, 30], urgent: false, posted: "2026-09-28", closes: "2026-11-30", places: 10,
      en: { title: "Poultry line worker", desc: "Trim, portion and tray chicken fillets on a conveyor. Team of twelve, half of them from Ukraine." },
      uk: { title: "Працівник лінії птахопереробки", desc: "Зачищаєте, порціюєте й розкладаєте курячі філе в лотки на конвеєрі. Бригада з дванадцяти людей, половина з України." } },
    { id: "j18", city: "kutno", district: "Grunwaldzka", sector: "packing", temp: 10, shift: [14, 22], type: "afternoon", days: "monfri", contract: "emp", rent: 480, noExp: false, langs: ["pl"], pay: [30, 35], urgent: false, posted: "2026-09-26", closes: "2026-11-20", places: 2,
      en: { title: "Packing machine operator", desc: "Set up and change formats on flow-wrap machines, fix small jams and keep the output log. Technical experience required." },
      uk: { title: "Оператор пакувальної машини", desc: "Налаштовуєте машини flow-pack і змінюєте формати, усуваєте дрібні збої, ведете журнал виробітку. Потрібен технічний досвід." } },
    { id: "j19", city: "lodz", district: "Retkinia", sector: "bakery", temp: 20, shift: [6, 14], type: "morning", days: "monsat", contract: "mandate", rent: null, noExp: false, langs: ["pl", "uk"], pay: [27, 31], urgent: false, posted: "2026-09-25", closes: "2026-12-20", places: 3,
      en: { title: "Confectionery decorator", desc: "Decorate cakes and tarts with cream, glaze and fruit to set designs. Pastry or decorating experience required." },
      uk: { title: "Декоратор кондитерських виробів", desc: "Оздоблюєте торти й тарти кремом, глазур’ю та фруктами за затвердженими зразками. Потрібен досвід кондитера або декоратора." } },
    { id: "j20", city: "lodz", district: "Olechów", sector: "cold", temp: -22, shift: [6, 14], type: "morning", days: "monfri", contract: "emp", rent: null, noExp: false, langs: ["pl", "en"], pay: [31, 35], urgent: false, posted: "2026-09-24", closes: "2026-11-30", places: 1,
      en: { title: "Freezer inventory clerk", desc: "Count stock, fix location errors in the warehouse system and prepare stocktake reports. Needs computer skills and basic Polish." },
      uk: { title: "Обліковець запасів морозильного складу", desc: "Проводите інвентаризацію, виправляєте помилки розміщення в складській системі, готуєте звіти. Потрібні навички роботи з комп’ютером і базова польська." } },
    { id: "j21", city: "lowicz", district: "Bratkowice", sector: "packing", temp: 6, shift: [6, 18], type: "long", days: "2on2off", contract: "temp", rent: 400, noExp: true, langs: ["uk", "ru", "pl"], pay: [25, 28], urgent: true, posted: "2026-10-15", closes: "2026-11-08", places: 14,
      en: { title: "Fruit and vegetable packer", desc: "Sort and pack apples, carrots and onions for supermarket chains. Seasonal peak until December, with a chance to stay on." },
      uk: { title: "Пакувальник овочів і фруктів", desc: "Сортуєте й пакуєте яблука, моркву та цибулю для мереж супермаркетів. Сезонний пік до грудня, можна залишитися надовше." } },
    { id: "j22", city: "wrzesnia", district: "Słomczyce", sector: "dairy", temp: 4, shift: [22, 6], type: "night", days: "monfri", contract: "emp", rent: 420, noExp: true, langs: ["pl", "uk"], pay: [28, 31], urgent: false, posted: "2026-09-29", closes: "2026-12-10", places: 3,
      en: { title: "Milk reception helper", desc: "Help receive milk tankers at night: connect hoses, take samples for the lab and wash tanks after unloading." },
      uk: { title: "Помічник на прийманні молока", desc: "Допомагаєте вночі приймати молоковози: під’єднуєте шланги, відбираєте проби для лабораторії, миєте цистерни після зливу." } },
    { id: "j23", city: "konin", district: "Chorzeń", sector: "meat", temp: 8, shift: [14, 22], type: "afternoon", days: "monfri", contract: "temp", rent: 450, noExp: true, langs: ["uk", "pl"], pay: [27, 30], urgent: false, posted: "2026-09-12", closes: "2026-10-10", places: 0, closed: true,
      en: { title: "Sausage production operator", desc: "Fill casings, hang sausages on smoking sticks and move trolleys to the smokehouse." },
      uk: { title: "Оператор виробництва ковбас", desc: "Набиваєте оболонку, розвішуєте ковбаси на палиці та переміщуєте візки до коптильні." } },
    { id: "j24", city: "lodz", district: "Bałuty", sector: "bakery", temp: 26, shift: [14, 22], type: "afternoon", days: "monsat", contract: "mandate", rent: 500, noExp: true, langs: ["pl", "uk"], pay: [25, 27], urgent: false, posted: "2026-09-15", closes: "2026-10-12", places: 0, closed: true,
      en: { title: "Seasonal packer, Christmas bakery", desc: "Pack gingerbread and Christmas cakes into gift boxes during the seasonal peak." },
      uk: { title: "Сезонний пакувальник, різдвяна випічка", desc: "Пакуєте пряники та різдвяні кекси в подарункові коробки під час сезонного піку." } }
  ],
  offices: [
    { id: "lodz", city: "lodz", kind: "office", street: "ul. Przykładowa 00", zip: "90-000", phone: "+48 000 000 000", email: "lodz@mostova.example",
      hours: [["monfri", "8:00–17:00"], ["sat", "9:00–13:00"]], langs: ["pl", "uk", "ru", "en"] },
    { id: "poznan", city: "poznan", kind: "office", street: "ul. Przykładowa 00", zip: "60-000", phone: "+48 000 000 001", email: "poznan@mostova.example",
      hours: [["monfri", "8:00–17:00"], ["sat", "closed"]], langs: ["pl", "uk", "en"] },
    { id: "kutno", city: "kutno", kind: "point", street: "ul. Przykładowa 00", zip: "99-300", phone: "+48 000 000 002", email: "kutno@mostova.example",
      hours: [["tuethu", "10:00–16:00"]], langs: ["pl", "uk"] }
  ],
  /* iso: room illustration variant (beds, colour); map: [x, y] on the Łódź district map, if any */
  housing: [
    { id: "h1", city: "lodz", district: "Widzew", kind: "hostel", perRoom: 2, rent: 450, minutes: 18, beds: 2, hue: "ice", map: [372, 140],
      amen: ["kitchen", "laundry", "wifi", "bus", "parking"],
      en: { name: "Widzew hostel", desc: "Three-storey hostel with twin rooms, a kitchen on every floor and a laundry in the basement. The plant bus stops at the door." },
      uk: { name: "Гуртожиток на Відзеві", desc: "Триповерховий гуртожиток із двомісними кімнатами, кухнею на кожному поверсі та пральнею в підвалі. Автобус до заводу зупиняється біля входу." } },
    { id: "h2", city: "lodz", district: "Bałuty", kind: "flat", perRoom: 2, rent: 520, minutes: 25, beds: 2, hue: "frost", map: [150, 70],
      amen: ["kitchen", "washer", "wifi", "tram"],
      en: { name: "Bałuty flat", desc: "Three-room flat for six people in a quiet block, with a full kitchen and its own washing machine. Tram to the transfer point in 10 minutes." },
      uk: { name: "Квартира на Балутах", desc: "Трикімнатна квартира на шістьох у тихому будинку: повноцінна кухня і власна пральна машина. Трамваєм до точки збору 10 хвилин." } },
    { id: "h3", city: "kutno", district: "Centrum", kind: "hostel", perRoom: 2, rent: 480, minutes: 12, beds: 2, hue: "ice",
      amen: ["kitchen", "laundry", "wifi", "bus"],
      en: { name: "Kutno centre hostel", desc: "Renovated hostel near the station, twin rooms with lockers, a shared kitchen and a common room with TV." },
      uk: { name: "Гуртожиток у центрі Кутна", desc: "Оновлений гуртожиток біля вокзалу: двомісні кімнати з шафками, спільна кухня та кімната відпочинку з телевізором." } },
    { id: "h4", city: "poznan", district: "Rataje", kind: "flat", perRoom: 2, rent: 600, minutes: 20, beds: 2, hue: "frost",
      amen: ["kitchen", "washer", "wifi", "tram", "balcony"],
      en: { name: "Rataje flat", desc: "Bright four-room flat on a tram line, two people per room, with a balcony and a dishwasher." },
      uk: { name: "Квартира на Ратаях", desc: "Світла чотирикімнатна квартира біля трамвайної лінії, по двоє в кімнаті, з балконом і посудомийною машиною." } },
    { id: "h5", city: "konin", district: "Zatorze", kind: "hostel", perRoom: 3, rent: 450, minutes: 15, beds: 3, hue: "ice",
      amen: ["kitchen", "laundry", "wifi", "bus", "parking"],
      en: { name: "Konin Zatorze hostel", desc: "Hostel with rooms for three, a large shared kitchen and free parking. Bus to both partner plants." },
      uk: { name: "Гуртожиток у Коніні, Заторже", desc: "Гуртожиток із тримісними кімнатами, великою спільною кухнею та безкоштовним паркуванням. Автобус до обох заводів-партнерів." } },
    { id: "h6", city: "lowicz", district: "Blich", kind: "guest", perRoom: 2, rent: 400, minutes: 10, beds: 2, hue: "frost",
      amen: ["kitchen", "washer", "wifi", "garden"],
      en: { name: "Łowicz guest house", desc: "Small guest house with a garden, twin rooms and a kitchen for twelve. A 10-minute walk to the bakery." },
      uk: { name: "Гостьовий будинок у Ловичі", desc: "Невеликий гостьовий будинок із садом, двомісними кімнатами та кухнею на дванадцятьох. 10 хвилин пішки до пекарні." } },
    { id: "h7", city: "wrzesnia", district: "Gutowo", kind: "hostel", perRoom: 2, rent: 420, minutes: 8, beds: 2, hue: "ice",
      amen: ["kitchen", "laundry", "wifi", "bus"],
      en: { name: "Września hostel", desc: "Modern hostel in the industrial district, twin rooms with their own shower, an 8-minute bus ride to the plants." },
      uk: { name: "Гуртожиток у Вжесні", desc: "Сучасний гуртожиток у промисловому районі: двомісні кімнати з власним душем, 8 хвилин автобусом до заводів." } }
  ]
};
