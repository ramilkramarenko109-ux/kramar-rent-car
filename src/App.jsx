import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, Route, Routes, useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import './App.css';
import { cars, filterCarsByBrandAndCategory, getAvailableCarBrands } from './carCatalog.js';
import { carDescriptions, rentalRateConfirmation } from './carDetails.js';
import { getSiteOrigin } from './siteConfig.js';

const fallbackImage = '/hero-911.png';
const publicAssetUrl = path => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
const paymentMethodLabels = {
 en: {heading:'Payment Methods',visa:'Visa',mastercard:'Mastercard',googlePay:'Google Pay',applePay:'Apple Pay',bitcoin:'Bitcoin',bankTransfer:'Bank transfer'},
 es: {heading:'Métodos de pago',visa:'Visa',mastercard:'Mastercard',googlePay:'Google Pay',applePay:'Apple Pay',bitcoin:'Bitcoin',bankTransfer:'Transferencia bancaria'},
 ua: {heading:'Способи оплати',visa:'Visa',mastercard:'Mastercard',googlePay:'Google Pay',applePay:'Apple Pay',bitcoin:'Bitcoin',bankTransfer:'Банківський переказ'},
};
const homeFilterCopy = {
 en: {brand:'Brand',allBrands:'All brands',clearBrand:'Clear brand',clearCategory:'Clear category',resetFilters:'Reset filters',noResults:'No cars found',noResultsHint:'Try changing or clearing the selected filters.',requestNote:'Location and dates are request preferences only; vehicle availability is not checked.',datesTogether:'Enter both dates to include a rental period.',pastDate:'Pick-up date cannot be in the past.',dateOrder:'Return date must be after the pick-up date.'},
 es: {brand:'Marca',allBrands:'Todas las marcas',clearBrand:'Borrar marca',clearCategory:'Borrar categoría',resetFilters:'Restablecer filtros',noResults:'No se encontraron coches',noResultsHint:'Pruebe a cambiar o borrar los filtros seleccionados.',requestNote:'La ubicación y las fechas son preferencias de la solicitud; no se comprueba la disponibilidad.',datesTogether:'Indique ambas fechas para incluir un periodo de alquiler.',pastDate:'La fecha de recogida no puede ser anterior a hoy.',dateOrder:'La fecha de devolución debe ser posterior a la de recogida.'},
 ua: {brand:'Марка',allBrands:'Усі марки',clearBrand:'Скинути марку',clearCategory:'Скинути категорію',resetFilters:'Скинути фільтри',noResults:'Автомобілі не знайдені',noResultsHint:'Змініть параметри або скиньте вибрані фільтри.',requestNote:'Місце та дати — лише побажання до запиту; наявність авто не перевіряється.',datesTogether:'Щоб вказати період оренди, заповніть обидві дати.',pastDate:'Дата отримання не може бути в минулому.',dateOrder:'Дата повернення має бути пізнішою за дату отримання.'},
};
const promotionLabels = {en:'Special offer',es:'Oferta especial',ua:'Спеціальна пропозиція'};
const kramarChoiceLabels = {
 en: {eyebrow:"KRAMAR'S CHOICE",title:"Kramar's Choice"},
 es: {eyebrow:'SELECCIÓN KRAMAR',title:'Selección KRAMAR'},
 ua: {eyebrow:'ВИБІР KRAMAR',title:'Вибір KRAMAR'},
};
const fleetPageTitle = { en: 'Our Fleet', es: 'Nuestra flota', ua: 'Автопарк' };
const fleetCategoryTitle = { en: 'Premium Cars', es: 'Coches Premium', ua: 'Автомобілі класу Premium' };
const seasonalFleetTitle = { en: 'Cars for summer escapes', es: 'Coches para disfrutar del verano', ua: 'Автомобілі для літнього відпочинку' };
const seasonalBestsellerLabels = { en: 'SEASONAL BESTSELLER', es: 'ÉXITO DE LA TEMPORADA', ua: 'ХІТ СЕЗОНУ' };
const requestContextLabels={
 en:{pickup:'Requested pick-up location',pickupDate:'Requested pick-up date',returnDate:'Requested return date',availability:'Location and dates are preferences only; availability is not confirmed.'},
 es:{pickup:'Lugar de recogida solicitado',pickupDate:'Fecha de recogida solicitada',returnDate:'Fecha de devolución solicitada',availability:'La ubicación y las fechas son preferencias; la disponibilidad no está confirmada.'},
 ua:{pickup:'Бажане місце отримання',pickupDate:'Бажана дата отримання',returnDate:'Бажана дата повернення',availability:'Місце та дати є побажаннями; наявність авто не підтверджено.'},
};
const notFoundCopy={
 en:{eyebrow:'404 · PAGE NOT FOUND',title:'This page could not be found',text:'The address may be incorrect or the page may have moved.',home:'GO TO HOME',fleet:'BROWSE THE FLEET'},
 es:{eyebrow:'404 · PÁGINA NO ENCONTRADA',title:'No se ha encontrado esta página',text:'Es posible que la dirección sea incorrecta o que la página se haya movido.',home:'IR AL INICIO',fleet:'VER LOS VEHÍCULOS'},
 ua:{eyebrow:'404 · СТОРІНКУ НЕ ЗНАЙДЕНО',title:'Не вдалося знайти цю сторінку',text:'Можливо, адресу вказано неправильно або сторінку переміщено.',home:'НА ГОЛОВНУ',fleet:'ПЕРЕГЛЯНУТИ АВТОПАРК'},
};
const routeSeoCopy={
 en:{
  home:['Premium Car Rental on the Costa Blanca | Kramar Rent Car','Explore Kramar Rent Car’s premium vehicle fleet on the Costa Blanca. Browse vehicle details and send a rental enquiry.'],
  fleet:['Premium Vehicle Fleet on the Costa Blanca | Kramar Rent Car','Browse sports cars, luxury vehicles and SUVs in the Kramar Rent Car fleet on the Costa Blanca.'],
  premium:['Premium Cars on the Costa Blanca | Kramar Rent Car','Explore the premium vehicle selection from Kramar Rent Car on the Costa Blanca.'],
  summer:['Cars for Summer Escapes | Kramar Rent Car','Discover the selected Porsche 911 Carrera and Audi R8 vehicles for summer trips on the Costa Blanca.'],
  about:['About Kramar Rent Car | Premium Car Rental Costa Blanca','Learn about Kramar Rent Car, its approach to premium mobility and vehicle rental on the Costa Blanca.'],
  faq:['Rental Questions and Answers | Kramar Rent Car','Find answers to common questions about contacting Kramar Rent Car and requesting a vehicle on the Costa Blanca.'],
  contacts:['Contact Kramar Rent Car | Costa Blanca','Contact Kramar Rent Car by phone or email about premium vehicle rental on the Costa Blanca.'],
  longTerm:['Long-Term Car Rental on the Costa Blanca | Kramar Rent Car','Explore long-term premium car rental options on the Costa Blanca and send an enquiry for a vehicle and rental period.'],
  notFound:['Page Not Found | Kramar Rent Car','The requested Kramar Rent Car page could not be found. Browse the fleet or return to the home page.'],
 },
 es:{
  home:['Alquiler de coches premium en Costa Blanca | Kramar Rent Car','Descubre la flota premium de Kramar Rent Car en Costa Blanca. Consulta los vehículos y envía una solicitud de alquiler.'],
  fleet:['Flota premium en Costa Blanca | Kramar Rent Car','Explora deportivos, vehículos de lujo y SUV de la flota Kramar Rent Car en Costa Blanca.'],
  premium:['Vehículos Premium en Costa Blanca | Kramar Rent Car','Descubre la selección de vehículos Premium de Kramar Rent Car en Costa Blanca.'],
  summer:['Coches para disfrutar del verano | Kramar Rent Car','Descubre la selección Porsche 911 Carrera y Audi R8 para tus viajes de verano en Costa Blanca.'],
  about:['Sobre Kramar Rent Car | Alquiler premium en Costa Blanca','Conoce Kramar Rent Car, su enfoque de movilidad premium y el alquiler de vehículos en Costa Blanca.'],
  faq:['Preguntas frecuentes sobre alquiler | Kramar Rent Car','Consulta respuestas a preguntas frecuentes y cómo solicitar un vehículo a Kramar Rent Car en Costa Blanca.'],
  contacts:['Contacto de Kramar Rent Car | Costa Blanca','Contacta con Kramar Rent Car por teléfono o correo electrónico para consultar el alquiler de vehículos en Costa Blanca.'],
  longTerm:['Alquiler de larga duración en Costa Blanca | Kramar Rent Car','Consulta opciones de alquiler premium de larga duración en Costa Blanca y envía una solicitud con el vehículo y el periodo deseados.'],
  notFound:['Página no encontrada | Kramar Rent Car','No se ha encontrado la página solicitada. Consulta la flota o vuelve a la página de inicio.'],
 },
 ua:{
  home:['Преміальна оренда авто на Costa Blanca | Kramar Rent Car','Перегляньте преміальний автопарк Kramar Rent Car на Costa Blanca, характеристики автомобілів і надішліть запит щодо оренди.'],
  fleet:['Автопарк преміальних авто на Costa Blanca | Kramar Rent Car','Перегляньте спортивні автомобілі, моделі класу люкс і SUV в автопарку Kramar Rent Car на Costa Blanca.'],
  premium:['Автомобілі Premium на Costa Blanca | Kramar Rent Car','Перегляньте добірку автомобілів Premium від Kramar Rent Car на Costa Blanca.'],
  summer:['Автомобілі для літнього відпочинку | Kramar Rent Car','Перегляньте Porsche 911 Carrera та Audi R8 для літніх поїздок на Costa Blanca.'],
  about:['Про Kramar Rent Car | Преміальна оренда авто на Costa Blanca','Дізнайтеся про Kramar Rent Car, філософію бренду та оренду преміальних автомобілів на Costa Blanca.'],
  faq:['Поширені запитання про оренду авто | Kramar Rent Car','Відповіді на поширені запитання та інформація про запит автомобіля в Kramar Rent Car на Costa Blanca.'],
  contacts:['Контакти Kramar Rent Car | Costa Blanca','Зв’яжіться з Kramar Rent Car телефоном або електронною поштою щодо оренди преміального авто на Costa Blanca.'],
  longTerm:['Довгострокова оренда авто на Costa Blanca | Kramar Rent Car','Перегляньте варіанти довгострокової оренди преміальних авто на Costa Blanca та надішліть запит щодо моделі й терміну.'],
  notFound:['Сторінку не знайдено | Kramar Rent Car','Запитану сторінку Kramar Rent Car не знайдено. Перейдіть до автопарку або на головну.'],
 },
};
function resolvePageSeo(pathname,search,lang){
 const localized=routeSeoCopy[lang]||routeSeoCopy.en;
 const path=pathname==='/'?'/':pathname.replace(/\/+$/,'');
 const params=new URLSearchParams(search);
 if(path==='/'){
  const [title,description]=localized.home;
  return {title,description,image:'/hero-911.png',indexable:true};
 }
 if(path==='/fleet'){
  const section=params.get('season')==='summer'?'summer':params.get('category')==='premium'?'premium':'fleet';
  const [title,description]=localized[section];
  return {title,description,image:'/hero-911.png',indexable:true};
 }
 const staticRoutes={'/about':'about','/faq':'faq','/contacts':'contacts','/long-term-rental':'longTerm'};
 if(staticRoutes[path]){
  const [title,description]=localized[staticRoutes[path]];
  return {title,description,image:path==='/long-term-rental'?'/long-term-rental-panamera-villa.jpg':'/hero-911.png',indexable:true};
 }
 const carMatch=path.match(/^\/cars\/([^/]+)$/);
 if(carMatch){
  const car=cars.find(item=>item.slug===carMatch[1]);
  if(car){
   const title=lang==='es'?`Alquiler de ${car.name} en Costa Blanca | Kramar Rent Car`:lang==='ua'?`Оренда ${car.name} на Costa Blanca | Kramar Rent Car`:`${car.name} Rental on the Costa Blanca | Kramar Rent Car`;
   const description=lang==='es'?`Consulta los detalles de ${car.name} y contacta con Kramar Rent Car para solicitar información de alquiler en Costa Blanca.`:lang==='ua'?`Перегляньте характеристики ${car.name} та зверніться до Kramar Rent Car щодо оренди на Costa Blanca.`:`View ${car.name} details and contact Kramar Rent Car about rental enquiries on the Costa Blanca.`;
   return {title,description,image:car.images[0],indexable:true};
  }
 }
 const [title,description]=localized.notFound;
 return {title,description,image:'/hero-911.png',indexable:false};
}
function updateMeta(attribute,key,value){
 const selector=`meta[${attribute}="${key}"]`;
 let element=document.head.querySelector(selector);
 if(!value){element?.remove();return}
 if(!element){element=document.createElement('meta');element.setAttribute(attribute,key);document.head.appendChild(element)}
 element.setAttribute('content',value);
}
function applyPageSeo(seo,pathname,lang){
 document.title=seo.title;
 document.documentElement.lang=lang;
 updateMeta('name','description',seo.description);
 updateMeta('name','robots',seo.indexable?'index, follow':'noindex, nofollow');
 updateMeta('property','og:title',seo.title);
 updateMeta('property','og:description',seo.description);
 updateMeta('property','og:type','website');
 updateMeta('property','og:site_name','Kramar Rent Car');
 updateMeta('property','og:locale',lang==='es'?'es_ES':lang==='ua'?'uk_UA':'en_US');
 const origin=getSiteOrigin();
 if(origin){
  const route=pathname==='/'?'/':pathname.replace(/\/+$/,'');
  const canonical=new URL(`${import.meta.env.BASE_URL}${route.replace(/^\/+/, '')}`,origin).href;
  let link=document.head.querySelector('link[rel="canonical"]');
  if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link)}
  link.href=canonical;
  updateMeta('property','og:url',canonical);
  updateMeta('property','og:image',new URL(publicAssetUrl(seo.image),origin).href);
  updateMeta('property','og:image:alt',seo.title);
  updateMeta('name','twitter:card','summary_large_image');
  updateMeta('name','twitter:title',seo.title);
  updateMeta('name','twitter:description',seo.description);
 }else{
  document.head.querySelector('link[rel="canonical"]')?.remove();
  updateMeta('property','og:url','');
  updateMeta('property','og:image','');
  updateMeta('property','og:image:alt','');
  updateMeta('name','twitter:card','');
  updateMeta('name','twitter:title','');
  updateMeta('name','twitter:description','');
 }
}
const longTermRentalCarSlugs = [
 'bmw-5-series',
 'mercedes-benz-s-class',
 'porsche-panamera-turbo-s',
 'range-rover-sport',
 'mercedes-maybach-s-class',
];
const longTermRentalCopy = {
 en: {
  heroTitle:'Your car. Your pace. No unnecessary worries.',
  heroText:'Long-term rental of premium cars on the Costa Blanca. Comfortable terms and a personal approach for every client.',
  offer:'Get an offer', benefitsTitle:'More freedom. Fewer commitments.',
  benefits:[['Special rates','Individual terms depending on the rental period.'],['Flexible terms','Choose a rental period that fits your needs.'],['Premium fleet','Cars of different classes for personal and business travel.'],['Personal approach','Help choosing a car and discussing the terms.']],
  carsTitle:'Choose a car for a longer stay',audienceTitle:'Your comfort on the Costa Blanca',
  audiences:['For those who have moved to the Costa Blanca','For those spending a few months here','For entrepreneurs and business trips','For those who need a car without buying one'],
  stepsTitle:'Just four steps',steps:['Send an enquiry','We will learn about your needs and rental period','We will find a suitable car','We will agree on the rental terms and details'],
  formTitle:'Let’s find a car for your plans',formIntro:'Tell us what car you need and for how long. We will prepare an individual proposal.',
  name:'Name',phone:'Phone or WhatsApp',vehicle:'Preferred car',choose:'Help me choose',period:'Approximate rental period',periodPlaceholder:'Choose a period',
  periods:[['under-month','Up to 1 month'],['1-3','1–3 months'],['3-6','3–6 months'],['over-6','More than 6 months'],['undecided','Not sure yet']],
  comment:'Comment (optional)',commentPlaceholder:'Tell us anything else that may help',submit:'Send enquiry',emailFallback:'Or contact us by email',submissionNote:'Your request will open as an email draft. The company phone number has not been confirmed as a WhatsApp account.',
  required:'Please fill in this required field.',finalTitle:'Ready to choose your car?',
  finalText:'Get in touch and we will help you choose a car and long-term rental terms.',
  contact:'Contact us',whatsappMessage:'Long-term rental enquiry',  commentLabel:'Comment',requestSubject:'Long-term rental enquiry',
 },
 es: {
  heroTitle:'Tu coche. Tu ritmo. Sin preocupaciones innecesarias.',
  heroText:'Alquiler de larga duración de coches premium en la Costa Blanca. Condiciones cómodas y atención personal para cada cliente.',
  offer:'Solicitar propuesta',benefitsTitle:'Más libertad. Menos compromisos.',
  benefits:[['Tarifas especiales','Condiciones individuales según la duración del alquiler.'],['Condiciones flexibles','Elige el periodo de alquiler que mejor se adapte a tus necesidades.'],['Flota premium','Vehículos de distintas clases para viajes personales y de negocios.'],['Atención personal','Ayuda para elegir el coche y acordar las condiciones.']],
  carsTitle:'Elige un coche para una estancia larga',audienceTitle:'Tu comodidad en la Costa Blanca',
  audiences:['Para quienes se han trasladado a la Costa Blanca','Para quienes pasan aquí varios meses','Para emprendedores y viajes de negocios','Para quienes necesitan un coche sin comprarlo'],
  stepsTitle:'Solo cuatro pasos',steps:['Envía una solicitud','Conoceremos tus necesidades y el periodo de alquiler','Buscaremos un coche adecuado','Acordaremos las condiciones y los detalles del alquiler'],
  formTitle:'Encontraremos un coche para tus planes',formIntro:'Cuéntanos qué coche necesitas y durante cuánto tiempo. Prepararemos una propuesta personalizada.',
  name:'Nombre',phone:'Teléfono o WhatsApp',vehicle:'Coche preferido',choose:'Ayudadme a elegir',period:'Duración aproximada del alquiler',periodPlaceholder:'Elige un periodo',
  periods:[['under-month','Hasta 1 mes'],['1-3','1–3 meses'],['3-6','3–6 meses'],['over-6','Más de 6 meses'],['undecided','Aún no lo sé']],
  comment:'Comentario (opcional)',commentPlaceholder:'Añade cualquier detalle que pueda ayudarnos',submit:'Enviar solicitud',emailFallback:'O escríbenos por correo electrónico',submissionNote:'La solicitud se abrirá como borrador de correo. El teléfono de la empresa no está confirmado como cuenta de WhatsApp.',
  required:'Completa este campo obligatorio.',finalTitle:'¿Listo para elegir tu coche?',
  finalText:'Ponte en contacto y te ayudaremos a elegir un coche y las condiciones de alquiler de larga duración.',
  contact:'Contactar',requestSubject:'Solicitud de alquiler de larga duración',commentLabel:'Comentario',
 },
 ua: {
  heroTitle:'Ваш автомобіль. Ваш ритм. Без зайвих турбот.',
  heroText:'Довгострокова оренда преміальних автомобілів на Costa Blanca. Комфортні умови та індивідуальний підхід до кожного клієнта.',
  offer:'Отримати пропозицію',benefitsTitle:"Більше свободи. Менше зобов'язань.",
  benefits:[['Спеціальні тарифи','Індивідуальні умови залежно від терміну оренди.'],['Гнучкі умови','Можливість підібрати період оренди відповідно до потреб.'],['Преміальний автопарк','Автомобілі різних класів для особистих і ділових поїздок.'],['Персональний підхід','Допомога у виборі автомобіля та узгодженні умов.']],
  carsTitle:'Оберіть автомобіль для тривалої оренди',audienceTitle:'Ваш комфорт на Costa Blanca',
  audiences:['Для тих, хто переїхав на Costa Blanca','Для тих, хто проводить тут кілька місяців','Для підприємців та ділових поїздок','Для тих, кому потрібен автомобіль без його придбання'],
  stepsTitle:'Усього чотири кроки',steps:['Залиште заявку','Ми уточнимо ваші потреби та термін оренди','Підберемо відповідний автомобіль','Узгодимо умови та деталі оренди'],
  formTitle:'Знайдемо автомобіль для ваших планів',formIntro:'Розкажіть нам, який автомобіль вам потрібен і на який термін. Ми підготуємо індивідуальну пропозицію.',
  name:"Ім'я",phone:'Телефон або WhatsApp',vehicle:'Бажаний автомобіль',choose:'Допоможіть обрати',period:'Орієнтовний термін оренди',periodPlaceholder:'Оберіть термін',
  periods:[['under-month','До 1 місяця'],['1-3','1–3 місяці'],['3-6','3–6 місяців'],['over-6','Понад 6 місяців'],['undecided','Ще не визначився']],
  comment:"Коментар (необов'язково)",commentPlaceholder:'Додайте деталі, які допоможуть нам підготувати пропозицію',submit:'Надіслати запит',emailFallback:'Або напишіть нам на електронну пошту',submissionNote:'Запит відкриється як чернетка електронного листа. Номер телефону компанії не підтверджено як обліковий запис WhatsApp.',
  required:"Будь ласка, заповніть це обов'язкове поле.",finalTitle:'Готові обрати свій автомобіль?',
  finalText:"Зв'яжіться з нами, і ми допоможемо підібрати автомобіль та умови довгострокової оренди.",
  contact:"Зв'язатися з нами",requestSubject:'Запит щодо довгострокової оренди',commentLabel:'Коментар',
 },
};
const longTermPeriodUkrainian = {
 'under-month':'До 1 місяця',
 '1-3':'1–3 місяці',
 '3-6':'3–6 місяців',
 'over-6':'Понад 6 місяців',
 undecided:'Ще не визначився',
};
const contactsCopy = {
 en: {eyebrow:'CONTACTS · KRAMAR RENT CAR',title:'Contact',location:'Location',phone:'Phone',email:'Email',follow:'Follow us',demo:'Phone and email are demonstration contact details.'},
 es: {eyebrow:'CONTACTO · KRAMAR RENT CAR',title:'Contacto',location:'Ubicación',phone:'Teléfono',email:'Correo electrónico',follow:'Síguenos',demo:'El teléfono y el correo son datos de contacto de demostración.'},
 ua: {eyebrow:'КОНТАКТИ · KRAMAR RENT CAR',title:'Контакти',location:'Місцезнаходження',phone:'Телефон',email:'Електронна пошта',follow:'Ми в соцмережах',demo:'Телефон та електронна пошта є демонстраційними контактними даними.'},
};
const faqCopy = {
 en: {
  title: 'Frequently Asked Questions',
  intro: 'Information about rental details is being confirmed by KRAMAR RENT CAR. Please contact our team for current details.',
  items: [
   {category:'Booking a vehicle',question:'How can I request a vehicle booking?',answer:'The booking process and vehicle availability are to be confirmed by the company. Please contact the KRAMAR RENT CAR team to discuss your request.'},
   {category:'Payment and deposit',question:'Which payment methods are available, and what deposit applies?',answer:'Accepted payment methods, payment timing and the vehicle-specific deposit are to be confirmed by the company. Please contact the team before making arrangements.'},
   {category:'Driver requirements',question:'What requirements apply to drivers?',answer:'Driver age, driving experience and other eligibility requirements are to be confirmed by the company for the selected vehicle. Please check with the team before booking.'},
   {category:'Documents',question:'Which documents should I provide?',answer:'The documents required for a rental have not yet been confirmed. Please ask the team which documents apply to your request.'},
   {category:'Vehicle collection and return',question:'Where and when can I collect and return the vehicle?',answer:'Collection and return locations, times and arrangements are agreed with the company and are to be confirmed for each booking. Please contact the team with your plans.'},
   {category:'Insurance',question:'What insurance is included with a rental?',answer:'Insurance coverage, exclusions and any applicable excess have not yet been confirmed. Please request the current terms from the company before booking.'},
   {category:'Mileage and restrictions',question:'Are there mileage limits or other use restrictions?',answer:'Mileage allowances and vehicle-use restrictions are to be confirmed by the company for the selected vehicle. Please check the applicable terms before travel.'},
   {category:'Additional services',question:'Can I request additional services?',answer:'Available additional services and their terms are to be confirmed by the company. Please contact the team to discuss what you need.'},
  ],
 },
 es: {
  title: 'Preguntas frecuentes',
  intro: 'KRAMAR RENT CAR está confirmando los detalles del alquiler. Contacte con nuestro equipo para obtener información actualizada.',
  items: [
   {category:'Reserva de vehículo',question:'¿Cómo puedo solicitar la reserva de un vehículo?',answer:'La empresa debe confirmar el proceso de reserva y la disponibilidad del vehículo. Contacte con el equipo de KRAMAR RENT CAR para consultar su solicitud.'},
   {category:'Pago y depósito',question:'¿Qué métodos de pago están disponibles y qué depósito se aplica?',answer:'La empresa debe confirmar los métodos de pago aceptados, los plazos de pago y el depósito correspondiente al vehículo. Consúltelo con el equipo antes de organizar el alquiler.'},
   {category:'Requisitos del conductor',question:'¿Qué requisitos se aplican a los conductores?',answer:'La edad, la experiencia de conducción y otros requisitos de elegibilidad deben confirmarse para el vehículo seleccionado. Consulte con el equipo antes de reservar.'},
   {category:'Documentación',question:'¿Qué documentos debo presentar?',answer:'La documentación necesaria para el alquiler aún no está confirmada. Pregunte al equipo qué documentos se aplican a su solicitud.'},
   {category:'Entrega y devolución del vehículo',question:'¿Dónde y cuándo puedo recoger y devolver el vehículo?',answer:'La empresa debe confirmar el lugar, el horario y las condiciones de entrega y devolución para cada reserva. Contacte con el equipo para comentar sus planes.'},
   {category:'Seguro',question:'¿Qué seguro incluye el alquiler?',answer:'La cobertura del seguro, las exclusiones y cualquier franquicia aplicable aún no están confirmadas. Solicite las condiciones vigentes a la empresa antes de reservar.'},
   {category:'Kilometraje y restricciones',question:'¿Hay límites de kilometraje u otras restricciones de uso?',answer:'La empresa debe confirmar el kilometraje incluido y las restricciones de uso del vehículo seleccionado. Consulte las condiciones aplicables antes de viajar.'},
   {category:'Servicios adicionales',question:'¿Puedo solicitar servicios adicionales?',answer:'La empresa debe confirmar qué servicios adicionales están disponibles y sus condiciones. Contacte con el equipo para explicar qué necesita.'},
  ],
 },
 ua: {
  title: 'Питання та відповіді',
  intro: 'KRAMAR RENT CAR уточнює умови оренди. Зверніться до нашої команди, щоб отримати актуальну інформацію.',
  items: [
   {category:'Бронювання автомобіля',question:'Як подати запит на бронювання автомобіля?',answer:'Порядок бронювання та доступність автомобіля має підтвердити компанія. Зверніться до команди KRAMAR RENT CAR, щоб обговорити ваш запит.'},
   {category:'Оплата та застава',question:'Які способи оплати доступні та яка застава застосовується?',answer:'Прийнятні способи й строки оплати, а також застава для конкретного автомобіля потребують підтвердження компанії. Уточніть деталі в команди перед оформленням.'},
   {category:'Вимоги до водія',question:'Які вимоги висуваються до водіїв?',answer:'Вік водія, стаж та інші вимоги до допуску має підтвердити компанія для обраного автомобіля. Перевірте ці умови в команди до бронювання.'},
   {category:'Документи',question:'Які документи потрібно надати?',answer:'Перелік документів для оренди ще не підтверджено. Запитайте команду, які документи потрібні для вашого запиту.'},
   {category:'Отримання та повернення автомобіля',question:'Де й коли можна отримати та повернути автомобіль?',answer:'Місце, час і порядок отримання та повернення узгоджуються з компанією та потребують підтвердження для кожного бронювання. Повідомте команді про ваші плани.'},
   {category:'Страхування',question:'Яке страхування входить в оренду?',answer:'Страхове покриття, винятки та можливу франшизу ще не підтверджено. Перед бронюванням запросіть у компанії актуальні умови.'},
   {category:'Пробіг та обмеження',question:'Чи є обмеження пробігу або інші обмеження використання?',answer:'Ліміт пробігу й обмеження використання обраного автомобіля має підтвердити компанія. Уточніть відповідні умови перед поїздкою.'},
   {category:'Додаткові послуги',question:'Чи можна замовити додаткові послуги?',answer:'Наявність додаткових послуг та умови їх надання має підтвердити компанія. Зверніться до команди й повідомте, що вам потрібно.'},
  ],
 },
};
const copy = {
 en:{aboutTitle:'A more personal way to move',aboutIntro:'At Kramar Rent Car, premium mobility is defined by thoughtful service, carefully considered details and a personal approach.',aboutApproach:'Our approach',aboutApproachText:'We believe renting a car should feel straightforward from the first conversation to the return of the keys. We focus on clear communication, attentive coordination and a vehicle that suits your plans.',aboutBenefits:'The Kramar experience',aboutBenefit1:'A considered selection',aboutBenefit1Text:'Choose a vehicle that fits the occasion, route and way you want to travel.',aboutBenefit2:'Personal coordination',aboutBenefit2Text:'A dedicated point of contact helps coordinate the details of your request.',aboutBenefit3:'Prepared for your journey',aboutBenefit3Text:'Vehicle handover and collection details are discussed with you in advance.',aboutBenefit4:'Flexible locations',aboutBenefit4Text:'Ask about delivery to the airport, hotel or another agreed location across Costa Blanca.',aboutClosing:'Your journey, arranged around you',aboutClosingText:'Tell us what you have in mind. We will help you choose the right car and discuss the details personally.',sport:'Sport Cars',luxury:'Luxury Sedans',suv:'SUV',premium:'Premium',specPower:'Engine power',specEngine:'Engine',specFuel:'Fuel consumption',specDrive:'Drive',specUnknown:'To be confirmed for the exact vehicle',home:'Home',fleet:'Our Fleet',offers:'Special Offers',about:'About Us',faq:'FAQ',contact:'Contact',book:'BOOK A CAR',heroEyebrow:'PREMIUM CAR RENTAL',heroTitle:'Drive Beyond Expectations.',heroText:'Exclusive cars. Unforgettable experiences. On the Costa Blanca and beyond.',featured:'FEATURED CARS',popular:'Our Most Popular Cars',viewAll:'VIEW ALL CARS',details:'DETAILS',from:'From',day:'/ day',category:'Category',pickup:'Pick-up location',pickupDate:'Pick-up date',returnDate:'Return date',search:'SEARCH CARS',discover:'DISCOVER',destination:'Costa Blanca in Style',destinationText:'Breathtaking roads, beautiful cities and unforgettable destinations. Explore Costa Blanca with the perfect car for your journey.',rates:'Rental rates',period:'Rental period',priceDay:'Price per day',deposit:'Security deposit',best:'BEST VALUE',request:'BOOK THIS CAR',back:'BACK TO FLEET',specs:'Vehicle details',conditions:'Rental Conditions',conditionsIntro:'Please note: the information below is a preparation template. Final rental terms must be confirmed by the company and reviewed for Spanish law before publication.',requirements:'Customer Requirements',documents:'Required Documents',security:'Security Deposit / Prepayment',collection:'Vehicle Collection / Return',restrictions:'Restrictions',responsibility:'Customer Responsibility',agreement:'Rental Agreement / Public Offer',services:'Additional Services',transmission:'Transmission',seats:'Seats',enquire:'Send enquiry',name:'Your name',email:'Email address',phone:'Phone number',message:'Message',send:'SEND ENQUIRY',formNote:'This demo form opens an email draft; it does not confirm a reservation.',placeholder:'Your message',priceOnRequest:"Price on request",priceToConfirm:"Price to be confirmed",imageRequirement:"Four genuine vehicle photographs are required",heroCarFrom:"From €350 / day",allCars:"All cars",sportCategory:"Sport Cars",luxuryCategory:"Luxury Sedans",feelPower:"Feel the power",travelComfort:"Travel in comfort",everyAdventure:"For every adventure",highestStandard:"The highest standard",premiumFleet:"Premium Fleet",carefullySelected:"Carefully selected vehicles",peaceMind:"Peace of Mind",personalSupport:"Personal support throughout your rental",supportTitle:"Personal Support",hereWhenNeed:"We’re here when you need us",flexibleLocations:"Flexible Locations",acrossCosta:"Across the Costa Blanca",exclusiveDeals:"Exclusive Deals",summerStyle:"Summer in Style",selectedVehicles:"Selected vehicles for your Costa Blanca stay",longTerm:"Long-Term Rental",extendedOptions:"Ask us about extended rental options",businessTravel:"Business Travel",businessMobility:"Premium mobility for your business",rights:"All rights reserved.",privacyTerms:"Privacy · Terms · Cookies",info:"INFORMATION",indicativeDeposit:"Vehicle-specific indicative deposit: see above.",agreementMissing:"PDF agreement: not yet supplied by the business. Add the approved document before launch.",eurDay:"EUR / DAY",demoRates:"DEMO RATES — CONFIRM BEFORE PUBLICATION",indicativeAmount:"Indicative demo amount — subject to confirmation",discoverDetail:"Discover the Costa Blanca in comfort and style. Contact our team to check availability, rental conditions and personalised options for this vehicle.",contactLocation:"Alicante, Costa Blanca, Spain",previousImage:"Previous image",nextImage:"Next image",showImage:"Show image",automatic:"Automatic",notFound:'Vehicle not found'},
 es:{aboutTitle:'Una forma más personal de moverse',aboutIntro:'En Kramar Rent Car, la movilidad premium se define por un servicio atento, los detalles cuidados y un trato personal.',aboutApproach:'Nuestra filosofía',aboutApproachText:'Creemos que alquilar un coche debe ser sencillo desde el primer contacto hasta la devolución de las llaves. Priorizamos la comunicación clara, la coordinación y un vehículo adecuado a sus planes.',aboutBenefits:'La experiencia Kramar',aboutBenefit1:'Selección cuidada',aboutBenefit1Text:'Elija un vehículo que se adapte a la ocasión, la ruta y su forma de viajar.',aboutBenefit2:'Atención personal',aboutBenefit2Text:'Un interlocutor le ayudará a coordinar los detalles de su solicitud.',aboutBenefit3:'Preparado para su viaje',aboutBenefit3Text:'Los detalles de entrega y recogida se acuerdan con antelación.',aboutBenefit4:'Ubicaciones flexibles',aboutBenefit4Text:'Consulte la entrega en el aeropuerto, hotel u otra ubicación acordada en Costa Blanca.',aboutClosing:'Su viaje, a su manera',aboutClosingText:'Cuéntenos qué necesita. Le ayudaremos a elegir el coche adecuado y coordinar los detalles.',sport:'Sport Cars',luxury:'Luxury Sedans',suv:'SUV',premium:'Premium',specPower:'Potencia',specEngine:'Motor',specFuel:'Consumo',specDrive:'Tracción',specUnknown:'Por confirmar para el vehículo exacto',home:'Inicio',fleet:'Vehículos',offers:'Ofertas especiales',about:'Sobre nosotros',faq:'Preguntas frecuentes',contact:'Contacto',book:'RESERVAR COCHE',heroEyebrow:'ALQUILER DE COCHES PREMIUM',heroTitle:'Conduce más allá de lo esperado.',heroText:'Coches exclusivos. Experiencias inolvidables. En la Costa Blanca y más allá.',featured:'VEHÍCULOS DESTACADOS',popular:'Nuestros coches más populares',viewAll:'VER TODOS',details:'DETALLES',from:'Desde',day:'/ día',category:'Categoría',pickup:'Lugar de recogida',pickupDate:'Fecha de recogida',returnDate:'Fecha de devolución',search:'BUSCAR COCHES',discover:'DESCUBRIR',destination:'Costa Blanca con estilo',destinationText:'Carreteras impresionantes, ciudades preciosas y destinos inolvidables. Descubre la Costa Blanca con el coche perfecto.',rates:'Tarifas de alquiler',period:'Periodo de alquiler',priceDay:'Precio por día',deposit:'Depósito de garantía',best:'MEJOR PRECIO',request:'RESERVAR ESTE COCHE',back:'VOLVER A VEHÍCULOS',specs:'Detalles del vehículo',conditions:'Condiciones de alquiler',conditionsIntro:'Aviso: la información siguiente es una plantilla de preparación. La empresa debe confirmar las condiciones definitivas y revisarlas conforme a la legislación española antes de publicarlas.',requirements:'Requisitos del cliente',documents:'Documentación necesaria',security:'Depósito / Pago anticipado',collection:'Entrega y devolución del vehículo',restrictions:'Restricciones',responsibility:'Responsabilidad del cliente',agreement:'Contrato de alquiler / Oferta pública',services:'Servicios adicionales',transmission:'Transmisión',seats:'Plazas',enquire:'Enviar consulta',name:'Nombre',email:'Correo electrónico',phone:'Teléfono',message:'Mensaje',send:'ENVIAR CONSULTA',formNote:'Este formulario de demostración abre un correo electrónico; no confirma una reserva.',placeholder:'Tu mensaje',priceOnRequest:"Precio a consultar",priceToConfirm:"Precio por confirmar",imageRequirement:"Se necesitan cuatro fotografías auténticas del vehículo",heroCarFrom:"Desde €350 / día",allCars:"Todos los coches",sportCategory:"Coches deportivos",luxuryCategory:"Berlinas de lujo",feelPower:"Siente la potencia",travelComfort:"Viaja con comodidad",everyAdventure:"Para cada aventura",highestStandard:"El máximo nivel",premiumFleet:"Flota premium",carefullySelected:"Vehículos seleccionados cuidadosamente",peaceMind:"Tranquilidad",personalSupport:"Atención personal durante todo el alquiler",supportTitle:"Atención personal",hereWhenNeed:"Estamos aquí cuando nos necesites",flexibleLocations:"Ubicaciones flexibles",acrossCosta:"En toda la Costa Blanca",exclusiveDeals:"Ofertas exclusivas",summerStyle:"Verano con estilo",selectedVehicles:"Vehículos seleccionados para su estancia en Costa Blanca",longTerm:"Alquiler de larga duración",extendedOptions:"Consulte nuestras opciones de alquiler prolongado",businessTravel:"Viajes de negocios",businessMobility:"Movilidad premium para su negocio",rights:"Todos los derechos reservados.",privacyTerms:"Privacidad · Condiciones · Cookies",info:"INFORMACIÓN",indicativeDeposit:"Depósito orientativo específico del vehículo: consulte arriba.",agreementMissing:"Contrato PDF: la empresa aún no lo ha facilitado. Añada el documento aprobado antes del lanzamiento.",eurDay:"EUR / DÍA",demoRates:"TARIFAS DE DEMOSTRACIÓN — CONFIRMAR ANTES DE PUBLICAR",indicativeAmount:"Importe orientativo de demostración — sujeto a confirmación",discoverDetail:"Descubra la Costa Blanca con comodidad y estilo. Contacte con nuestro equipo para consultar disponibilidad, condiciones de alquiler y opciones personalizadas para este vehículo.",contactLocation:"Alicante, Costa Blanca, España",previousImage:"Imagen anterior",nextImage:"Imagen siguiente",showImage:"Mostrar imagen",automatic:"Automático",notFound:'Vehículo no encontrado'},
 ua:{aboutTitle:'Більш персональний підхід до подорожей',aboutIntro:'У Kramar Rent Car преміальний сервіс — це увага до деталей, продуманий підхід і персональна комунікація.',aboutApproach:'Наш підхід',aboutApproachText:'Ми вважаємо, що оренда автомобіля має бути простою від першого звернення до повернення ключів. Ми зосереджуємося на зрозумілій комунікації, уважній координації та підборі авто відповідно до ваших планів.',aboutBenefits:'Досвід Kramar',aboutBenefit1:'Продуманий вибір',aboutBenefit1Text:'Оберіть автомобіль відповідно до події, маршруту та стилю подорожі.',aboutBenefit2:'Персональна координація',aboutBenefit2Text:'Особистий контакт допоможе узгодити деталі вашого запиту.',aboutBenefit3:'Підготовка до подорожі',aboutBenefit3Text:'Деталі отримання та повернення автомобіля узгоджуються заздалегідь.',aboutBenefit4:'Зручні локації',aboutBenefit4Text:'Уточніть можливість доставки до аеропорту, готелю чи іншого узгодженого місця на Costa Blanca.',aboutClosing:'Ваша подорож — за вашими правилами',aboutClosingText:'Розкажіть, що вам потрібно. Ми допоможемо обрати автомобіль і узгодити деталі.',sport:'Sport Cars',luxury:'Luxury Sedans',suv:'SUV',premium:'Premium',specPower:'Потужність',specEngine:'Двигун',specFuel:'Витрата пального',specDrive:'Привід',specUnknown:'Потрібно підтвердити для конкретного авто',home:'Головна',fleet:'Автопарк',offers:'Спеціальні пропозиції',about:'Про нас',faq:'Питання та відповіді',contact:'Контакти',book:'ЗАБРОНЮВАТИ АВТО',heroEyebrow:'ПРЕМІАЛЬНА ОРЕНДА АВТО',heroTitle:'Вирушайте за межі очікувань.',heroText:'Ексклюзивні автомобілі. Незабутні враження. На Costa Blanca та за її межами.',featured:'РЕКОМЕНДОВАНІ АВТО',popular:'Наші популярні автомобілі',viewAll:'УСІ АВТОМОБІЛІ',details:'ДЕТАЛІ',from:'Від',day:'/ день',category:'Категорія',pickup:'Місце отримання',pickupDate:'Дата отримання',returnDate:'Дата повернення',search:'ЗНАЙТИ АВТО',discover:'ВІДКРИЙТЕ',destination:'Costa Blanca зі стилем',destinationText:'Мальовничі дороги, красиві міста та незабутні місця. Відкрийте Costa Blanca на ідеальному автомобілі.',rates:'Тарифи оренди',period:'Період оренди',priceDay:'Ціна за день',deposit:'Застава',best:'НАЙВИГІДНІШЕ',request:'ЗАМОВИТИ ЦЕ АВТО',back:'НАЗАД ДО АВТОПАРКУ',specs:'Характеристики авто',conditions:'Умови оренди',conditionsIntro:'Зверніть увагу: наведена нижче інформація є шаблоном для підготовки. Остаточні умови має підтвердити компанія та перевірити відповідно до законодавства Іспанії перед публікацією.',requirements:'Вимоги до клієнта',documents:'Необхідні документи',security:'Застава / Передоплата',collection:'Отримання та повернення автомобіля',restrictions:'Обмеження',responsibility:'Відповідальність клієнта',agreement:'Договір оренди / Публічна оферта',services:'Додаткові послуги',transmission:'Коробка передач',seats:'Місця',enquire:'Надіслати запит',name:'Ваше ім’я',email:'Електронна пошта',phone:'Телефон',message:'Повідомлення',send:'НАДІСЛАТИ ЗАПИТ',formNote:'Демонстраційна форма відкриває чернетку електронного листа та не підтверджує бронювання.',placeholder:'Ваше повідомлення',priceOnRequest:"Ціна за запитом",priceToConfirm:"Ціну потрібно уточнити",imageRequirement:"Потрібні чотири оригінальні фотографії автомобіля",heroCarFrom:"Від €350 / день",allCars:"Усі автомобілі",sportCategory:"Спортивні автомобілі",luxuryCategory:"Автомобілі класу люкс",feelPower:"Відчуйте потужність",travelComfort:"Подорожуйте з комфортом",everyAdventure:"Для будь-якої пригоди",highestStandard:"Найвищий стандарт",premiumFleet:"Преміальний автопарк",carefullySelected:"Ретельно підібрані автомобілі",peaceMind:"Впевненість і спокій",personalSupport:"Персональна підтримка протягом оренди",supportTitle:"Персональна підтримка",hereWhenNeed:"Ми поруч, коли потрібна допомога",flexibleLocations:"Зручні локації",acrossCosta:"Уздовж Costa Blanca",exclusiveDeals:"Спеціальні пропозиції",summerStyle:"Літо зі стилем",selectedVehicles:"Автомобілі для вашого відпочинку на Costa Blanca",longTerm:"Довгострокова оренда",extendedOptions:"Дізнайтеся про варіанти тривалої оренди",businessTravel:"Ділові подорожі",businessMobility:"Преміальна мобільність для вашого бізнесу",rights:"Усі права захищені.",privacyTerms:"Конфіденційність · Умови · Cookies",info:"ІНФОРМАЦІЯ",indicativeDeposit:"Орієнтовна застава для конкретного авто: див. вище.",agreementMissing:"PDF-договір: компанія ще не надала документ. Додайте затверджений документ перед запуском.",eurDay:"ЄВРО / ДЕНЬ",demoRates:"ДЕМОНСТРАЦІЙНІ ТАРИФИ — ПОТРІБНО ПІДТВЕРДИТИ",indicativeAmount:"Орієнтовна демонстраційна сума — потребує підтвердження",discoverDetail:"Відкрийте для себе Costa Blanca з комфортом і стилем. Зв’яжіться з нами, щоб уточнити доступність, умови оренди та індивідуальні можливості для цього автомобіля.",contactLocation:"Аліканте, Costa Blanca, Іспанія",previousImage:"Попереднє фото",nextImage:"Наступне фото",showImage:"Показати фото",automatic:"Автоматична",notFound:'Автомобіль не знайдено'}
};
const conditionContent = {
 en:[['Age, driving experience and a valid licence requirements must be confirmed for each vehicle category.','Any chauffeur service is subject to availability and written confirmation.'],['A valid identity document and driving licence are expected. International customers may need an accepted international driving permit depending on their country of issue. Confirm requirements before booking.'],['The vehicle-specific deposit shown above is indicative only. Payment method, prepayment, cancellation and deposit-release timing must be confirmed in the final rental agreement.'],['Collection and return location, delivery availability, fuel level, inspection procedure and out-of-hours fees must be agreed in writing before handover.'],['Mileage allowance, excess-mileage rate, permitted territory, cross-border travel, additional drivers, smoking, pets and track use must be confirmed in the signed agreement.'],['The renter must promptly report accidents, theft, damage or warning lights and follow the insurer and rental company instructions. Coverage, excess and exclusions depend on the actual insurance policy.'],['The final rental agreement and any public offer must be supplied and approved by the company. No binding PDF contract is included in this demo.'],['Airport delivery, additional driver, child seat and extra mileage may be offered only when confirmed by the company. Prices are to be agreed before booking.']],
 es:[['La edad mínima, la experiencia de conducción y los requisitos del permiso deben confirmarse para cada categoría.','El servicio con conductor depende de la disponibilidad y de una confirmación por escrito.'],['Se requiere un documento de identidad válido y permiso de conducir. Según el país de expedición, los clientes internacionales podrían necesitar un permiso internacional. Confirme los requisitos antes de reservar.'],['El depósito indicado para cada vehículo es orientativo. El método de pago, anticipo, cancelación y plazo de devolución deben confirmarse en el contrato definitivo.'],['El lugar de entrega y devolución, la disponibilidad de entrega, el combustible, la inspección y los posibles cargos fuera de horario deben acordarse por escrito.'],['El kilometraje, coste por exceso, territorio permitido, viajes al extranjero, conductores adicionales, fumar, mascotas y uso en circuito deben constar en el contrato.'],['El cliente debe comunicar inmediatamente accidentes, robo, daños o avisos del vehículo y seguir las instrucciones de la aseguradora y de la empresa. La cobertura y franquicia dependen de la póliza real.'],['La empresa debe facilitar y aprobar el contrato definitivo y cualquier oferta pública. Esta demo no incluye un contrato PDF vinculante.'],['La entrega en aeropuerto, conductor adicional, silla infantil y kilometraje extra solo estarán disponibles previa confirmación.']],
 ua:[['Мінімальний вік, водійський стаж і вимоги до посвідчення потрібно підтвердити для кожної категорії авто.','Оренда з водієм можлива лише за наявності послуги та письмового підтвердження.'],['Потрібні дійсний документ, що посвідчує особу, та водійське посвідчення. Для іноземних клієнтів залежно від країни видачі може знадобитися міжнародне посвідчення. Уточніть вимоги до бронювання.'],['Зазначена для авто застава є орієнтовною. Спосіб оплати, передоплату, скасування та строки повернення застави потрібно підтвердити в остаточному договорі.'],['Місце видачі й повернення, доставка, рівень пального, огляд та можливі збори поза робочим часом мають бути письмово погоджені.'],['Ліміт пробігу, вартість перевищення, дозволена територія, виїзд за кордон, додаткові водії, куріння, тварини та використання на треку мають бути визначені договором.'],['Клієнт повинен негайно повідомити про ДТП, викрадення, пошкодження чи попередження автомобіля та виконувати інструкції страховика й компанії. Покриття і франшиза залежать від реального полісу.'],['Остаточний договір оренди та публічну оферту має надати й затвердити компанія. У цій демонстраційній версії юридично чинного PDF-договору немає.'],['Доставка в аеропорт, додатковий водій, дитяче крісло та додатковий пробіг доступні лише після підтвердження компанією.']]
};
const conditionTitles = {en:['Customer Requirements','Required Documents','Security Deposit / Prepayment','Vehicle Collection / Return','Restrictions','Customer Responsibility','Rental Agreement / Public Offer','Additional Services'],es:['Requisitos del cliente','Documentación necesaria','Depósito / Pago anticipado','Entrega y devolución del vehículo','Restricciones','Responsabilidad del cliente','Contrato de alquiler / Oferta pública','Servicios adicionales'],ua:['Вимоги до клієнта','Необхідні документи','Застава / Передоплата','Отримання та повернення автомобіля','Обмеження','Відповідальність клієнта','Договір оренди / Публічна оферта','Додаткові послуги']};
const rateMultipliers=[1,.92,.84,.76,.68];
const rateLabels={en:['1–3 days','4–7 days','8–14 days','15–29 days','30+ days'],es:['1–3 días','4–7 días','8–14 días','15–29 días','30+ días'],ua:['1–3 дні','4–7 днів','8–14 днів','15–29 днів','30+ днів']};
function Brand(){return <Link className="brand" to="/"><img className="brand-logo" src={publicAssetUrl('/kramar-logo.png')} alt="Kramar Rent Car"/></Link>}
function LanguagePicker({lang,setLang}){return <select className="language" aria-label="Language" value={lang} onChange={e=>setLang(e.target.value)}><option value="en">EN</option><option value="es">ES</option><option value="ua">UA</option></select>}
const mobileNavigationCopy={en:{open:'Open navigation',close:'Close navigation',label:'Main navigation'},es:{open:'Abrir navegación',close:'Cerrar navegación',label:'Navegación principal'},ua:{open:'Відкрити навігацію',close:'Закрити навігацію',label:'Головна навігація'}};
const bookingDialogCloseLabels={en:'Close booking request',es:'Cerrar solicitud de reserva',ua:'Закрити запит на оренду'};
function Header({t,lang,setLang}){
 const [menuOpen,setMenuOpen]=useState(false);
 const menuButtonRef=useRef(null);
 const navigationRef=useRef(null);
 const labels=mobileNavigationCopy[lang];
 useEffect(()=>{
  if(!menuOpen)return;
  navigationRef.current?.querySelector('a')?.focus();
  const handleKeyDown=e=>{
   if(e.key==='Escape'){
    setMenuOpen(false);
    menuButtonRef.current?.focus();
   }
  };
  const handleResize=()=>{if(window.innerWidth>700)setMenuOpen(false)};
  window.addEventListener('keydown',handleKeyDown);
  window.addEventListener('resize',handleResize);
  return()=>{window.removeEventListener('keydown',handleKeyDown);window.removeEventListener('resize',handleResize)};
 },[menuOpen]);
 const closeMenu=()=>setMenuOpen(false);
 return <header className="header">
  <Brand/>
  <nav className={`navigation mobile-navigation${menuOpen?' is-open':''}`} id="main-navigation" aria-label={labels.label} aria-hidden={!menuOpen&&window.innerWidth<=700} ref={navigationRef}>
   <Link to="/" onClick={closeMenu}>{t.home}</Link><Link to="/fleet" onClick={closeMenu}>{t.fleet}</Link><Link to="/cars/porsche-panamera-turbo-s" onClick={closeMenu}>{t.offers}</Link><Link to="/about" onClick={closeMenu}>{t.about}</Link><Link to="/faq" onClick={closeMenu}>{t.faq}</Link><Link to="/contacts" onClick={closeMenu}>{t.contact}</Link><Link className="mobile-book-link button button-dark" to="/fleet" onClick={closeMenu}>{t.book}</Link>
  </nav>
  <div className="header-actions">
   <LanguagePicker lang={lang} setLang={setLang}/>
   <button ref={menuButtonRef} className="mobile-menu-toggle" type="button" aria-label={menuOpen?labels.close:labels.open} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={()=>setMenuOpen(open=>!open)}>
    <span aria-hidden="true">{menuOpen?'×':'☰'}</span>
   </button>
   <Link className="button button-dark" to="/fleet">{t.book}</Link>
  </div>
 </header>;
}
function Footer({t}){return <footer className="footer" id="contact"><div className="footer-main"><Brand/><div><Link to="/">{t.home}</Link><Link to="/fleet">{t.fleet}</Link><Link to="/cars/porsche-panamera-turbo-s">{t.offers}</Link></div><div><Link to="/about">{t.about}</Link><Link to="/faq">{t.faq}</Link><Link to="/contacts">{t.contact}</Link></div><div className="contact-info"><span>+34 612 345 678</span><span>info@kramarrentcar.com</span><span>{t.contactLocation}</span></div></div><div className="footer-bottom"><span>© 2026 Kramar Rent Car. {t.rights}</span><span>{t.privacyTerms}</span></div></footer>}
function PaymentMethods({lang}){const labels=paymentMethodLabels[lang];return <section className="payment-methods section" aria-labelledby="payment-methods-title"><h2 id="payment-methods-title">{labels.heading}</h2><ul className="payment-method-list"><li><img src={publicAssetUrl('/payment-methods/visa.svg')} alt={labels.visa}/></li><li><img src={publicAssetUrl('/payment-methods/mastercard.svg')} alt={labels.mastercard}/></li><li><img src={publicAssetUrl('/payment-methods/googlepay.svg')} alt={labels.googlePay}/></li><li><img src={publicAssetUrl('/payment-methods/applepay.svg')} alt={labels.applePay}/></li><li><img src={publicAssetUrl('/payment-methods/bitcoin.svg')} alt={labels.bitcoin}/></li><li><img src={publicAssetUrl('/payment-methods/bank-transfer.svg')} alt={labels.bankTransfer}/></li></ul></section>}
function validDateInput(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return false;const [year,month,day]=value.split('-').map(Number);const parsed=new Date(Date.UTC(year,month-1,day));return parsed.getUTCFullYear()===year&&parsed.getUTCMonth()===month-1&&parsed.getUTCDate()===day}
function getTodayDateInputValue(){const today=new Date();return `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`}
function getSwipeHandlers(onLeft,onRight){let start=0;return {onTouchStart:e=>{start=e.touches[0].clientX},onTouchEnd:e=>{const d=e.changedTouches[0].clientX-start;if(Math.abs(d)>45)(d<0?onLeft:onRight)()}}}
function categoryLabel(category,t){if(category==='Sport'||category==='Sport Cars')return t.sport;if(category==='Luxury & Business')return t.luxury;if(category==='SUV')return t.suv;if(category==='Premium')return t.premium;return category}
function transmissionLabel(value,t){return value==='Automatic'?t.automatic:value}
function FleetPage({t,lang,setLang}){const [searchParams]=useSearchParams();const seasonalOnly=searchParams.get('season')==='summer';const premiumOnly=!seasonalOnly&&searchParams.get('category')==='premium';const sortedCars=useMemo(()=>[...cars].filter(car=>seasonalOnly?car.seasonalBestseller:!premiumOnly||car.category==='Premium').sort((a,b)=>a.name.localeCompare(b.name,'en',{sensitivity:'base',numeric:true})),[seasonalOnly,premiumOnly]);return <main><Header t={t} lang={lang} setLang={setLang}/><section className="fleet-page section"><div className="section-heading fleet-page-heading"><div><span className="eyebrow">{t.featured}</span><h1>{seasonalOnly?seasonalFleetTitle[lang]:premiumOnly?fleetCategoryTitle[lang]:fleetPageTitle[lang]}</h1></div><span>{sortedCars.length}</span></div><div className="car-grid">{sortedCars.map((car,index)=><CarCard car={car} t={t} lang={lang} loading={index<2?'eager':'lazy'} key={car.slug}/>)}</div></section><Footer t={t}/></main>}
function ContactSocialIcon({name,children}){return <span className="contact-social-icon" role="img" aria-label={name}><svg viewBox="0 0 32 32" aria-hidden="true">{children}</svg></span>}
function ContactsPage({t,lang,setLang}){const content=contactsCopy[lang];return <main><Header t={t} lang={lang} setLang={setLang}/><section className="contacts-page section"><header className="contacts-heading"><span className="eyebrow">{content.eyebrow}</span><h1>{content.title}</h1></header><div className="contacts-grid"><div className="contact-item"><span className="eyebrow">{content.location}</span><p>Alicante, Costa Blanca, Spain</p></div><div className="contact-item"><span className="eyebrow">{content.phone}</span><a href="tel:+34612345678">+34 612 345 678</a></div><div className="contact-item"><span className="eyebrow">{content.email}</span><a href="mailto:info@kramarrentcar.com">info@kramarrentcar.com</a></div><div className="contact-item contact-socials"><span className="eyebrow">{content.follow}</span><div className="contact-social-list"><ContactSocialIcon name="WhatsApp"><path d="M16 4.5a11.2 11.2 0 0 0-9.6 17l-1 4 4.1-1A11.5 11.5 0 1 0 16 4.5Z"/><path d="M12.2 10c.4-.5.7-.4 1-.1l1.1 1.7c.2.3.1.6-.1.8l-.8.8a8 8 0 0 0 3.5 3.5l.8-.9c.2-.2.5-.3.8-.1l1.8 1c.3.2.4.6.2.9-.5 1-1.6 1.6-2.8 1.5-3.6-.4-7.8-4.5-8.2-8.1-.1-1.2.5-2.4 1.5-2.9Z"/></ContactSocialIcon><ContactSocialIcon name="Telegram"><path d="m4 14 22-8-6.9 21-5.2-8-4.4 3 .8-6.1L24 8 11.4 18"/><path d="m13.9 19 5.4 3.6"/></ContactSocialIcon><ContactSocialIcon name="Viber"><path d="M8 5.5h3.3l2 5-2.2 1.8a17 17 0 0 0 8.6 8.6l1.8-2.2 5 2v3.3c0 1.2-1 2.2-2.2 2.2C13 26.2 5.8 19 5.8 7.7 5.8 6.5 6.8 5.5 8 5.5Z"/><path d="M17.5 6c4.6.8 7.4 3.6 8.2 8.2M17.5 9.5c2.6.6 4.1 2.1 4.7 4.7"/></ContactSocialIcon><ContactSocialIcon name="Instagram"><rect x="5" y="5" width="22" height="22" rx="6"/><circle cx="16" cy="16" r="5"/><circle cx="23" cy="9" r="1" fill="currentColor" stroke="none"/></ContactSocialIcon></div></div></div><p className="contacts-demo-note">{content.demo}</p><p className="contacts-signature">KRAMAR RENT CAR · COSTA BLANCA</p></section><Footer t={t}/></main>}
function FaqPage({t,lang,setLang}){const [open,setOpen]=useState(-1);const content=faqCopy[lang];return <main><Header t={t} lang={lang} setLang={setLang}/><section className="faq-page section"><div className="faq-page-heading"><span className="eyebrow">{t.info}</span><h1>{content.title}</h1><p>{content.intro}</p></div><div className="accordion faq-accordion">{content.items.map((item,i)=><article className={`accordion-item faq-item ${open===i?'open':''}`} key={item.category}><span className="faq-category">{item.category}</span><button aria-expanded={open===i} aria-controls={`faq-answer-${i}`} onClick={()=>setOpen(open===i?-1:i)}><span>{String(i+1).padStart(2,'0')}</span><strong>{item.question}</strong><b aria-hidden="true">{open===i?'−':'+'}</b></button><div id={`faq-answer-${i}`} className={`faq-answer ${open===i?'is-open':''}`} aria-hidden={open!==i}><div><p>{item.answer}</p></div></div></article>)}</div></section><Footer t={t}/></main>}
function OptimizedCarImage({src,alt,loading='lazy',fetchPriority,onClick,onError}){const [useOriginal,setUseOriginal]=useState(false);const assetSrc=publicAssetUrl(src);const webpSrc=assetSrc.replace(/\.(?:png|jpe?g)$/i,'.webp');const handleError=e=>{if(!useOriginal&&webpSrc!==assetSrc){setUseOriginal(true);return}onError?.(e)};return <picture>{!useOriginal&&<source type="image/webp" srcSet={webpSrc}/>}<img src={assetSrc} alt={alt} loading={loading} decoding="async" fetchPriority={fetchPriority} onClick={onClick} onError={handleError}/></picture>}
function CarGalleryImage({src,alt,pendingText,className,onClick,loading='lazy',fetchPriority}){const [failedSource,setFailedSource]=useState('');if(failedSource===src)return <div className={`image-pending ${className||''}`}>{pendingText}</div>;return <OptimizedCarImage key={src} src={src} alt={alt} loading={loading} fetchPriority={fetchPriority} onClick={onClick} onError={()=>setFailedSource(src)}/>}
function CarCard({car,t,lang,requestParams='',loading='lazy'}){const [index,setIndex]=useState(0);const detailPath=`/cars/${car.slug}${requestParams?`?${requestParams}`:''}`;const next=(e,delta)=>{e.preventDefault();e.stopPropagation();setIndex(i=>(i+delta)%car.images.length<0?car.images.length-1:(i+delta)%car.images.length)};return <article className="car-card"><div className="car-gallery" {...getSwipeHandlers(()=>setIndex(i=>(i+1)%car.images.length),()=>setIndex(i=>(i-1+car.images.length)%car.images.length))}><Link to={detailPath}>{car.images.length?<CarGalleryImage src={car.images[index]} alt={car.name} pendingText={t.imageRequirement} loading={loading}/>:<div className="image-pending">{t.imageRequirement}</div>}</Link>{car.seasonalBestseller&&<span className="seasonal-badge">{seasonalBestsellerLabels[lang]}</span>}{car.images.length>1&&<><button className="gallery-arrow gallery-prev" onClick={e=>next(e,-1)} aria-label={t.previousImage}>‹</button><button className="gallery-arrow gallery-next" onClick={e=>next(e,1)} aria-label={t.nextImage}>›</button><span className="gallery-count">{index+1}/{car.images.length}</span></>}</div><div className="car-info"><h3><Link to={detailPath}>{car.name}</Link></h3><div className="car-meta"><span>{categoryLabel(car.category,t)}</span><span>{transmissionLabel(car.transmission,t)||t.specUnknown}</span>{car.seats!=null&&<span>{car.seats} {t.seats.toLowerCase()}</span>}</div><div className="car-price"><span>{car.price==null?<strong>{t.priceOnRequest}</strong>:car.promotion?<span className="car-promo-price"><span><del>€{car.promotion.regularPrice}</del><strong>{t.from} €{car.price} {t.day}</strong></span><small className="promotion-badge">{promotionLabels[lang]}</small></span>:<>{t.from} <strong>€{car.price} {t.day}</strong></>}</span><Link to={detailPath}>{t.details}</Link></div></div></article>}

function HomeFleetSection({t,lang}){
 const [searchParams,setSearchParams]=useSearchParams();
 const initialBrand=searchParams.get('brand')||'';
 const initialCategory=searchParams.get('category')||'';
 const initialPickup=searchParams.get('pickup')||'Alicante Airport';
 const initialPickupDate=validDateInput(searchParams.get('pickupDate'))?searchParams.get('pickupDate'):'';
 const initialReturnDate=validDateInput(searchParams.get('returnDate'))?searchParams.get('returnDate'):'';
 const [selectedBrand,setSelectedBrand]=useState(initialBrand);
 const [selectedCategory,setSelectedCategory]=useState(initialCategory);
 const [appliedBrand,setAppliedBrand]=useState(initialBrand);
 const [appliedCategory,setAppliedCategory]=useState(initialCategory);
 const [pickupLocation,setPickupLocation]=useState(initialPickup);
 const [pickupDate,setPickupDate]=useState(initialPickupDate);
 const [returnDate,setReturnDate]=useState(initialReturnDate);
 const [dateError,setDateError]=useState('');
 const [searchCount,setSearchCount]=useState(0);
 const brands=useMemo(()=>getAvailableCarBrands(),[]);
 const filteredCars=useMemo(()=>filterCarsByBrandAndCategory({brand:appliedBrand||undefined,category:appliedCategory||undefined}),[appliedBrand,appliedCategory]);
 const filterText=homeFilterCopy[lang];
 const hasFilters=Boolean(selectedBrand||selectedCategory||appliedBrand||appliedCategory);
 const groups=[
  {id:'sport-cars',name:t.sport,desc:t.feelPower,category:'Sport'},
  {id:'luxury-sedans',name:t.luxury,desc:t.travelComfort,category:'Luxury & Business'},
  {id:'suv',name:t.suv,desc:t.everyAdventure,category:'SUV'},
  {id:'premium',name:t.premium,desc:t.highestStandard,category:'Premium'},
 ];
 useEffect(()=>{if(searchCount)document.querySelector('#fleet')?.scrollIntoView({behavior:'smooth',block:'start'})},[searchCount]);
 const changeBrand=value=>setSelectedBrand(value);
 const changeCategory=value=>setSelectedCategory(value==='all'?'':value);
 const writeRequestParams=(brand,category)=>{
  const params=new URLSearchParams();
  if(brand)params.set('brand',brand);
  if(category)params.set('category',category);
  if(pickupLocation)params.set('pickup',pickupLocation);
  if(pickupDate)params.set('pickupDate',pickupDate);
  if(returnDate)params.set('returnDate',returnDate);
  setSearchParams(params,{replace:true});
 };
 const searchCars=()=>{
  setDateError('');
  if(Boolean(pickupDate)!==Boolean(returnDate)){setDateError('datesTogether');return}
  const today=new Date();
  today.setHours(0,0,0,0);
  if(pickupDate&&new Date(`${pickupDate}T00:00:00`)<today){setDateError('pastDate');return}
  if(pickupDate&&returnDate&&new Date(`${returnDate}T00:00:00`)<=new Date(`${pickupDate}T00:00:00`)){setDateError('dateOrder');return}
  setAppliedBrand(selectedBrand);
  setAppliedCategory(selectedCategory);
  writeRequestParams(selectedBrand,selectedCategory);
  setSearchCount(count=>count+1);
 };
 const resetFilters=()=>{setSelectedBrand('');setSelectedCategory('');setAppliedBrand('');setAppliedCategory('');setDateError('');writeRequestParams('','')};
 const requestParams=new URLSearchParams();
 if(pickupLocation)requestParams.set('pickup',pickupLocation);
 if(pickupDate)requestParams.set('pickupDate',pickupDate);
 if(returnDate)requestParams.set('returnDate',returnDate);
 const requestContext=requestParams.toString();
 const todayInputValue=getTodayDateInputValue();
 return <>
  <section className="booking" id="booking">
   <label><span className="field-icon"><svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></span><div>{t.pickup}<select value={pickupLocation} onChange={e=>setPickupLocation(e.target.value)}><option>Alicante Airport</option><option>Torrevieja</option><option>Benidorm</option></select></div></label>
   <label><span className="field-icon"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg></span><div>{t.pickupDate}<input type="date" value={pickupDate} min={todayInputValue} aria-invalid={Boolean(dateError)} aria-describedby={dateError?'booking-date-error':undefined} onChange={e=>{setPickupDate(e.target.value);setDateError('')}}/></div></label>
   <label><span className="field-icon"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg></span><div>{t.returnDate}<input type="date" value={returnDate} min={pickupDate||todayInputValue} aria-invalid={Boolean(dateError)} aria-describedby={dateError?'booking-date-error':undefined} onChange={e=>{setReturnDate(e.target.value);setDateError('')}}/></div></label>
   <div className="booking-filter-field"><span className="field-icon"><svg viewBox="0 0 24 24"><path d="M3 15.5 5 9h14l2 6.5v3h-2v-2H5v2H3z"/><path d="M6 9l1.5-4h9L18 9M6.5 12.5h.01M17.5 12.5h.01"/></svg></span><div><label htmlFor="home-brand-filter">{filterText.brand}</label><select id="home-brand-filter" value={selectedBrand} onChange={e=>changeBrand(e.target.value)}><option value="">{filterText.allBrands}</option>{brands.map(brand=><option key={brand} value={brand}>{brand}</option>)}</select></div>{selectedBrand&&<button type="button" className="booking-filter-clear" onClick={()=>changeBrand('')}>{filterText.clearBrand}</button>}</div>
   <div className="booking-filter-field"><span className="field-icon"><svg viewBox="0 0 24 24"><path d="M3 15.5 5 9h14l2 6.5v3h-2v-2H5v2H3z"/><path d="M6 9l1.5-4h9L18 9M6.5 12.5h.01M17.5 12.5h.01"/></svg></span><div><label htmlFor="home-category-filter">{t.category}</label><select id="home-category-filter" value={selectedCategory||'all'} onChange={e=>changeCategory(e.target.value)}><option value="all">{t.allCars}</option><option value="Sport">{t.sportCategory}</option><option value="Luxury & Business">{t.luxuryCategory}</option><option value="SUV">SUV</option><option value="Premium">{t.premium}</option></select></div>{selectedCategory&&<button type="button" className="booking-filter-clear" onClick={()=>changeCategory('all')}>{filterText.clearCategory}</button>}</div>
   <button type="button" className="button button-dark search-button" onClick={searchCars}>{t.search}</button>
   <p className="booking-request-note" role="note">{filterText.requestNote}</p>
   {dateError&&<p className="booking-date-error" id="booking-date-error" role="alert">{filterText[dateError]}</p>}
  </section>
  <section className="categories section">{[{n:t.sport.toUpperCase(),d:t.feelPower,id:'sport-cars'},{n:t.luxury.toUpperCase(),d:t.travelComfort,id:'luxury-sedans'},{n:t.suv.toUpperCase(),d:t.everyAdventure,id:'suv'},{n:t.premium.toUpperCase(),d:t.highestStandard,id:'premium'}].map((c,i)=><a className="category-card" href={`#${c.id}`} key={c.n}><div className="category-copy"><strong>{c.n}</strong><span>{c.d}</span></div><OptimizedCarImage src={cars[[0,4,6,9][i]].images[0]} alt={c.n} loading="lazy"/></a>)}</section>
  <section className="fleet section" id="fleet">
   <div className="section-heading"><div><span className="eyebrow">{t.featured}</span><h2>{t.popular}</h2></div><div className="fleet-heading-actions">{hasFilters&&filteredCars.length>0&&<button type="button" className="filter-reset" onClick={resetFilters}>{filterText.resetFilters}</button>}<Link to="/fleet">{t.viewAll}</Link></div></div>
   {!filteredCars.length?<div className="filter-empty" role="status"><strong>{filterText.noResults}</strong><span>{filterText.noResultsHint}</span><button type="button" className="filter-reset" onClick={resetFilters}>{filterText.resetFilters}</button></div>:groups.map(group=>{const groupCars=filteredCars.filter(car=>car.category===group.category||(group.category==='Sport'&&car.category==='Sport Cars'));return groupCars.length>0&&<section className="fleet-group" id={group.id} data-category={group.category} key={group.id}><div className="fleet-group-heading"><span className="eyebrow">{group.name.toUpperCase()}</span><p>{group.desc}</p></div><div className="car-grid">{groupCars.map(car=><CarCard car={car} t={t} lang={lang} requestParams={requestContext} key={car.slug}/>)}</div></section>})}
  </section>
 </>;
}
function HomePage({t,lang,setLang}){
 return <main>
  <Header t={t} lang={lang} setLang={setLang}/>
  <section className="hero" style={{'--hero-background-image':`url("${publicAssetUrl(fallbackImage)}")`}}><div className="hero-content"><span className="eyebrow">{t.heroEyebrow}</span><h1>{t.heroTitle}</h1><p>{t.heroText}</p><Link to="/fleet" className="button button-dark">{t.book}</Link></div><div className="hero-caption"><strong>PORSCHE 911 CARRERA</strong><span>{t.heroCarFrom}</span></div></section>
  <HomeFleetSection t={t} lang={lang}/>
  <section className="benefits" id="about"><div><span>◇</span><p><strong>{t.premiumFleet}</strong><small>{t.carefullySelected}</small></p></div><div><span>♧</span><p><strong>{t.peaceMind}</strong><small>{t.personalSupport}</small></p></div><div><span>◷</span><p><strong>{t.supportTitle}</strong><small>{t.hereWhenNeed}</small></p></div><div><span>⌖</span><p><strong>{t.flexibleLocations}</strong><small>{t.acrossCosta}</small></p></div></section>
  <section className="destination"><div className="destination-content"><span className="eyebrow">{t.discover}</span><h2>{t.destination}</h2><p>{t.destinationText}</p><a className="button button-dark" href="#contact">{t.contact}</a></div></section>
  <section className="offers section" id="offers"><div className="section-heading"><div><span className="eyebrow">{kramarChoiceLabels[lang].eyebrow}</span><h2>{kramarChoiceLabels[lang].title}</h2></div></div><div className="offer-grid"><Link className="offer-card" to="/fleet?season=summer" aria-label={t.summerStyle}><img src={publicAssetUrl('/offers/911.png')} alt="Porsche"/><div><h3>{t.summerStyle}</h3><p>{t.selectedVehicles}</p><span>{t.contact}</span></div></Link><Link className="offer-card" to="/long-term-rental" aria-label={t.longTerm}><img src={publicAssetUrl('/offers/panamera.png')} alt="Costa Blanca"/><div><h3>{t.longTerm}</h3><p>{t.extendedOptions}</p><span>{t.contact}</span></div></Link><Link className="offer-card" to="/fleet?category=premium" aria-label={t.businessTravel}><img src={publicAssetUrl('/offers/maybach.png')} alt="Premium travel"/><div><h3>{t.businessTravel}</h3><p>{t.businessMobility}</p><span>{t.contact}</span></div></Link></div></section>
  <PaymentMethods lang={lang}/><Footer t={t}/>
 </main>;
}
function LongTermRentalPage({t,lang,setLang}){
 const content=longTermRentalCopy[lang];
 const rentalCars=longTermRentalCarSlugs.map(slug=>cars.find(car=>car.slug===slug)).filter(Boolean);
 const sendRequest=e=>{
  e.preventDefault();
  const formData=new FormData(e.currentTarget);
  const selectedCar=rentalCars.find(car=>car.slug===formData.get('vehicle'));
  const duration=longTermPeriodUkrainian[formData.get('period')];
  const lines=[
   'Запит щодо довгострокової оренди',
   `Ім'я: ${formData.get('name')}`,
   `Контактний телефон: ${formData.get('phone')}`,
   `Бажаний автомобіль: ${selectedCar?.name||longTermRentalCopy.ua.choose}`,
   `Бажаний термін оренди: ${duration}`,
  ];
  const comment=formData.get('comment').trim();
  if(comment)lines.push(`${longTermRentalCopy.ua.commentLabel}: ${comment}`);
  const subject=encodeURIComponent(longTermRentalCopy.ua.requestSubject);
  const body=encodeURIComponent(lines.join('\n'));
  window.open(`mailto:info@kramarrentcar.com?subject=${subject}&body=${body}`,'_self');
 };
 const scrollToRequest=()=>document.getElementById('long-term-request')?.scrollIntoView({behavior:'smooth',block:'start'});
 return <main className="long-term-page">
  <Header t={t} lang={lang} setLang={setLang}/>
  <section className="long-term-hero">
   <img src={publicAssetUrl('/long-term-rental-panamera-villa.jpg')} alt="Black Porsche Panamera at a Costa Blanca villa"/>
   <div className="long-term-hero-copy"><span className="eyebrow">KRAMAR RENT CAR · COSTA BLANCA</span><h1>{content.heroTitle}</h1><p>{content.heroText}</p><button className="button button-dark" type="button" onClick={scrollToRequest}>{content.offer}</button></div>
  </section>
  <section className="long-term-benefits section"><div className="section-heading"><div><span className="eyebrow">{t.premiumFleet}</span><h2>{content.benefitsTitle}</h2></div></div><div className="long-term-benefit-grid">{content.benefits.map(([title,text],i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  <section className="long-term-cars section"><div className="section-heading"><div><span className="eyebrow">{t.featured}</span><h2>{content.carsTitle}</h2></div></div><div className="car-grid">{rentalCars.map(car=><CarCard car={car} t={t} lang={lang} key={car.slug}/>)}</div></section>
  <section className="long-term-audience section"><div className="section-heading"><div><span className="eyebrow">COSTA BLANCA</span><h2>{content.audienceTitle}</h2></div></div><div className="long-term-audience-grid">{content.audiences.map((text,i)=><article key={text}><span>0{i+1}</span><p>{text}</p></article>)}</div></section>
  <section className="long-term-steps section"><div className="section-heading"><div><span className="eyebrow">{t.info}</span><h2>{content.stepsTitle}</h2></div></div><ol>{content.steps.map((text,i)=><li key={text}><span>0{i+1}</span><p>{text}</p></li>)}</ol></section>
  <section className="long-term-form-section section" id="long-term-request"><div className="long-term-form-heading"><span className="eyebrow">{t.contact}</span><h2>{content.formTitle}</h2><p>{content.formIntro}</p></div><form className="long-term-form" onSubmit={sendRequest}><label>{content.name}<input name="name" autoComplete="name" required/></label><label>{content.phone}<input name="phone" type="tel" autoComplete="tel" required/></label><label>{content.vehicle}<select name="vehicle" defaultValue="help" required><option value="help">{content.choose}</option>{rentalCars.map(car=><option value={car.slug} key={car.slug}>{car.name}</option>)}</select></label><label>{content.period}<select name="period" defaultValue="" required><option value="" disabled>{content.periodPlaceholder}</option>{content.periods.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label><label className="long-term-comment">{content.comment}<textarea name="comment" placeholder={content.commentPlaceholder}/></label><button type="submit" className="button button-dark">{content.submit}</button><a className="long-term-email-link" href="mailto:info@kramarrentcar.com">{content.emailFallback}</a><p className="long-term-submission-note">{content.submissionNote}</p></form></section>
  <section className="long-term-final section"><span className="eyebrow">KRAMAR RENT CAR</span><h2>{content.finalTitle}</h2><p>{content.finalText}</p><Link className="button button-dark" to="/contacts">{content.contact}</Link></section>
  <Footer t={t}/>
 </main>;
}
function AboutPage({t,lang,setLang}){return <main><Header t={t} lang={lang} setLang={setLang}/><section className="about-hero section"><span className="eyebrow">KRAMAR RENT CAR · COSTA BLANCA</span><h1>{t.aboutTitle}</h1><p>{t.aboutIntro}</p></section><section className="about-story section"><div><span className="eyebrow">{t.aboutApproach}</span><h2>{t.aboutApproachText}</h2></div><div className="about-image"><img src={publicAssetUrl('/hero-911.png')} alt={t.aboutTitle}/></div></section><section className="about-benefits section"><span className="eyebrow">{t.aboutBenefits}</span><div className="about-benefit-grid">{[1,2,3,4].map(i=><article key={i}><span>0{i}</span><h3>{t['aboutBenefit'+i]}</h3><p>{t['aboutBenefit'+i+'Text']}</p></article>)}</div></section><section className="about-closing section"><h2>{t.aboutClosing}</h2><p>{t.aboutClosingText}</p><Link className="button button-dark" to="/#booking">{t.book}</Link></section><footer className="footer"><div className="footer-bottom"><Brand/><span>© 2026 Kramar Rent Car.</span><Link to="/">{t.home}</Link></div></footer></main>}
function NotFoundPage({t,lang,setLang}){const content=notFoundCopy[lang];return <main><Header t={t} lang={lang} setLang={setLang}/><section className="not-found section"><span className="eyebrow">{content.eyebrow}</span><h1>{content.title}</h1><p>{content.text}</p><div className="not-found-actions"><Link className="button button-dark" to="/">{content.home}</Link><Link className="button button-dark" to="/fleet">{content.fleet}</Link></div></section><Footer t={t}/></main>}
function RentalConditions({lang,t}){const [open,setOpen]=useState(-1);return <section className="conditions"><div className="section-heading"><div><span className="eyebrow">{t.info}</span><h2>{t.conditions}</h2></div></div><p className="conditions-note">{t.conditionsIntro}</p><div className="accordion">{conditionTitles[lang].map((title,i)=><article className={`accordion-item ${open===i?'open':''}`} key={title}><button onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}><span>{String(i+1).padStart(2,'0')}</span><strong>{title}</strong><b>{open===i?'−':'+'}</b></button>{open===i&&<div className="accordion-content">{conditionContent[lang][i].map((line,j)=><p key={j}>{line}</p>)}{i===2&&<p><strong>{t.indicativeDeposit}</strong></p>}{i===6&&<p><em>{t.agreementMissing}</em></p>}</div>}</article>)}</div></section>}
function Rates({car,t,lang}){const periods=['1-3','4-7','8-14','15-29','30+'];return <section className="rates"><div className="rates-head"><div><span className="eyebrow">{t.eurDay}</span><h2>{t.rates}</h2></div><span className="demo-tag">{t.demoRates}</span></div><div className="rates-table"><div className="rates-row rates-header"><span>{t.period}</span><span>{t.priceDay}</span></div>{rateLabels[lang].map((label,i)=>{const amount=car.rentalRates?car.rentalRates[periods[i]]:Math.round(car.price*rateMultipliers[i]);const promotion=car.promotion?.period===periods[i];return <div className={`rates-row ${i===4?'best-rate':''} ${promotion?'promo-rate':''}`} key={label}><span>{label}{i===4&&<small>{t.best}</small>}</span><strong>{amount==null?rentalRateConfirmation[lang]:promotion?<><del>€{car.promotion.regularPrice}</del><span>€{amount}</span><small className="promotion-badge">{promotionLabels[lang]}</small></>:`€${amount}`}</strong></div>})}</div><div className="deposit-line"><span>{t.deposit}</span><strong>€{car.deposit.toLocaleString('en-US')}</strong><small>{t.indicativeAmount}</small></div></section>}
function CarPage({t,lang,setLang}){
 const {slug}=useParams();
 const [searchParams]=useSearchParams();
 const navigate=useNavigate();
 const car=cars.find(x=>x.slug===slug);
 const requestContextText=requestContextLabels[lang];
 const requestPickup=searchParams.get('pickup');
 const requestPickupDate=searchParams.get('pickupDate');
 const requestReturnDate=searchParams.get('returnDate');
 const [index,setIndex]=useState(0);
 const [lightbox,setLightbox]=useState(false);
 const [showForm,setShowForm]=useState(false);
 const bookingTriggerRef=useRef(null);
 const bookingDialogRef=useRef(null);
 const images=car?.images||[fallbackImage];
 const move=delta=>setIndex(i=>(i+delta+images.length)%images.length);
 useEffect(()=>{const key=e=>{if(e.key==='Escape')setLightbox(false);if(e.key==='ArrowRight')setIndex(i=>(i+1)%images.length);if(e.key==='ArrowLeft')setIndex(i=>(i-1+images.length)%images.length)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[images.length,slug]);
 useEffect(()=>{
  if(!showForm)return;
  const previouslyFocused=document.activeElement;
  const dialog=bookingDialogRef.current;
  const getFocusable=()=>Array.from(dialog?.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')||[]);
  getFocusable()[0]?.focus();
  const onKeyDown=e=>{
   if(e.key==='Escape'){e.preventDefault();setShowForm(false);return}
   if(e.key!=='Tab')return;
   const focusable=getFocusable();
   if(!focusable.length){e.preventDefault();return}
   const first=focusable[0],last=focusable[focusable.length-1];
   if(e.shiftKey&&(document.activeElement===first||!dialog?.contains(document.activeElement))){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&(document.activeElement===last||!dialog?.contains(document.activeElement))){e.preventDefault();first.focus()}
  };
  document.addEventListener('keydown',onKeyDown);
  return()=>{
   document.removeEventListener('keydown',onKeyDown);
   if(previouslyFocused instanceof HTMLElement&&previouslyFocused.isConnected)previouslyFocused.focus();
  };
 },[showForm]);
 if(!car)return <main><Header t={t} lang={lang} setLang={setLang}/><section className="not-found"><h1>{t.notFound}</h1><Link className="button button-dark" to="/fleet">{t.back}</Link></section></main>;
 return <main>
  <Header t={t} lang={lang} setLang={setLang}/>
  <section className="car-detail section">
   <button className="back-link" onClick={()=>navigate('/fleet')}>{t.back}</button>
   <div className="detail-layout">
    <div className="detail-gallery" {...getSwipeHandlers(()=>move(1),()=>move(-1))}>
     <div className="detail-main-image">{images.length?<CarGalleryImage src={images[index]} alt={`${car.name} ${index+1}`} pendingText={t.imageRequirement} className="detail-pending" onClick={()=>setLightbox(true)} loading="eager" fetchPriority="high"/>:<div className="image-pending detail-pending">{t.imageRequirement}</div>}{images.length>1&&<><button className="detail-arrow prev" onClick={()=>move(-1)} aria-label={t.previousImage}>‹</button><button className="detail-arrow next" onClick={()=>move(1)} aria-label={t.nextImage}>›</button><span className="gallery-count">{index+1}/{images.length}</span></>}</div>
     <div className="detail-thumbnails">{car.images.length>0&&images.map((src,i)=><button className={index===i?'active':''} key={src} onClick={()=>setIndex(i)} aria-label={`${t.showImage} ${i+1}`}><CarGalleryImage src={src} alt={`${car.name} view ${i+1}`} pendingText="" className="thumbnail-pending" loading="lazy"/></button>)}</div>
    </div>
    <div className="detail-copy">
     <span className="eyebrow">{categoryLabel(car.category,t).toUpperCase()}</span>
     <h1>{car.name}</h1>
     {car.seasonalBestseller&&<span className="seasonal-badge detail-seasonal-badge">{seasonalBestsellerLabels[lang]}</span>}
     {car.promotion?<p className="detail-price promo-detail-price"><span className="promo-current-price">€{car.price} <small>{t.day}</small></span><span className="promo-regular-price"><del>€{car.promotion.regularPrice}</del> <small>{t.day}</small></span><span className="promotion-badge">{promotionLabels[lang]}</span></p>:<p className="detail-price">{car.price==null?t.priceToConfirm:<>€{car.price} <small>{t.day}</small></>}</p>}
     <div className="detail-specs"><span>{transmissionLabel(car.transmission,t)||t.specUnknown}</span><span>{car.seats??t.specUnknown}{car.seats==null?'':` ${t.seats}`}</span>{car.year&&<span>{car.year}</span>}</div>
     <div className="technical-specs"><h2>{t.specs}</h2><dl><div><dt>{t.specEngine}</dt><dd>{car.engine||t.specUnknown}</dd></div><div><dt>{t.specPower}</dt><dd>{car.power||t.specUnknown}</dd></div><div><dt>{t.specFuel}</dt><dd>{!car.consumption||car.consumption==='To be confirmed for the exact vehicle'?t.specUnknown:car.consumption}</dd></div><div><dt>{t.specDrive}</dt><dd>{car.drive||t.specUnknown}</dd></div></dl></div>
     <p>{car.descriptionKey?carDescriptions[lang][car.descriptionKey]:t.discoverDetail}</p>
     <button ref={bookingTriggerRef} className="button button-dark" onClick={()=>setShowForm(true)}>{t.request}</button>
    </div>
   </div>
   {car.price!=null&&car.deposit!=null&&<Rates car={car} t={t} lang={lang}/>}
   <RentalConditions lang={lang} t={t}/>
  </section>
  <footer className="footer"><div className="footer-bottom"><Brand/><span>© 2026 Kramar Rent Car.</span><Link to="/contacts">{t.contact}</Link><Link to="/">{t.home}</Link></div></footer>
  {lightbox&&<div className="lightbox" role="dialog" aria-modal="true" onClick={()=>setLightbox(false)}><button className="lightbox-close" onClick={()=>setLightbox(false)}>×</button><button className="detail-arrow prev" onClick={e=>{e.stopPropagation();move(-1)}}>‹</button><OptimizedCarImage key={images[index]} src={images[index]} alt={car.name} loading="eager" onClick={e=>e.stopPropagation()}/><button className="detail-arrow next" onClick={e=>{e.stopPropagation();move(1)}}>›</button><span>{index+1}/{images.length}</span></div>}
  {showForm&&<div className="modal-backdrop" onClick={()=>setShowForm(false)}><form ref={bookingDialogRef} className="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-dialog-title" onSubmit={e=>{e.preventDefault();const d=new FormData(e.currentTarget);const subject=encodeURIComponent(`Rental enquiry — ${car.name}`);const requestedFields=[requestPickup&&`${requestContextText.pickup}: ${requestPickup}`,validDateInput(requestPickupDate)&&`${requestContextText.pickupDate}: ${requestPickupDate}`,validDateInput(requestReturnDate)&&`${requestContextText.returnDate}: ${requestReturnDate}`].filter(Boolean);const bodyLines=[`Vehicle: ${car.name}`,`Name: ${d.get('name')}`,`Email: ${d.get('email')}`,`Phone: ${d.get('phone')}`,`Message: ${d.get('message')}`];if(requestedFields.length)bodyLines.push('',...requestedFields,requestContextText.availability);const body=encodeURIComponent(bodyLines.join('\n'));window.location.href=`mailto:info@kramarrentcar.com?subject=${subject}&body=${body}`;}} onClick={e=>e.stopPropagation()}><button type="button" className="modal-close" aria-label={bookingDialogCloseLabels[lang]} onClick={()=>setShowForm(false)}>×</button><span className="eyebrow">{car.name}</span><h2 id="enquiry-dialog-title">{t.enquire}</h2><input name="name" placeholder={t.name} required/><input name="email" type="email" placeholder={t.email} required/><input name="phone" placeholder={t.phone}/><textarea name="message" placeholder={t.placeholder}/><button className="button button-dark" type="submit">{t.send}</button><small>{t.formNote}</small></form></div>}
 </main>;
}
export default function App(){const [lang,setLang]=useState(()=>{const saved=localStorage.getItem('kramar-language');return ['en','es','ua'].includes(saved)?saved:'en'});const location=useLocation();const {pathname}=location;const t=useMemo(()=>copy[lang]||copy.en,[lang]);const seo=useMemo(()=>resolvePageSeo(pathname,location.search,lang),[pathname,location.search,lang]);useLayoutEffect(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,0);document.documentElement.style.scrollBehavior=''},[pathname]);useEffect(()=>{localStorage.setItem('kramar-language',lang)},[lang]);useEffect(()=>{applyPageSeo(seo,pathname,lang)},[seo,pathname,lang]);return <Routes><Route path="/" element={<HomePage t={t} lang={lang} setLang={setLang}/>}/><Route path="/fleet" element={<FleetPage t={t} lang={lang} setLang={setLang}/>}/><Route path="/faq" element={<FaqPage t={t} lang={lang} setLang={setLang}/>}/><Route path="/about" element={<AboutPage t={t} lang={lang} setLang={setLang}/>}/><Route path="/contacts" element={<ContactsPage t={t} lang={lang} setLang={setLang}/>}/><Route path="/long-term-rental" element={<LongTermRentalPage t={t} lang={lang} setLang={setLang}/>}/><Route path="/cars/:slug" element={<CarPage key={pathname} t={t} lang={lang} setLang={setLang}/>}/><Route path="*" element={<NotFoundPage t={t} lang={lang} setLang={setLang}/>}/></Routes>}
