/**
 * P'tit Paris — carte complète (Ouagadougou, Burkina Faso).
 * Transcrite depuis menu.ptitparis.com (édition du 8 septembre 2026).
 * Prix en francs CFA (F CFA).
 */

export type Tag = "house" | "veg" | "spicy";

export type Item = {
  /** Identifiant base (absent pour la carte statique). */
  id?: string;
  slug?: string;
  name: string;
  desc?: string;
  /** Prix unique, ou [moyenne, grande] / [verre, bouteille]. */
  price: number | [number, number];
  tags?: Tag[];
  /** Chemin public de la photo (extraite de la carte) ou /media/<id>. */
  photo?: string;
  /** false = en rupture (affiché barré, non commandable). */
  available?: boolean;
};

export type Section = {
  id: string;
  title: string;
  tagline?: string;
  /** Photos d'ambiance de la rubrique (sans plat associé). */
  gallery?: string[];
  /** Libellé des deux colonnes de prix, ex. "Moyenne / Grande". */
  dual?: string;
  note?: string;
  items: Item[];
};

export type Book = {
  id: "dej" | "diner" | "bar";
  title: string;
  subtitle: string;
  hours: string;
  sections: Section[];
};

export const TAG_LABEL: Record<Tag, { label: string; emoji: string }> = {
  house: { label: "Spécialité maison", emoji: "👑" },
  veg: { label: "Végétarien", emoji: "🌿" },
  spicy: { label: "Spicy", emoji: "🌶️" },
};

/* ------------------------------------------------------------------ */
/* Sections partagées                                                  */
/* ------------------------------------------------------------------ */

const sandwichsFroids: Section = {
  id: "sandwichs-froids",
  title: "Sandwichs Froids",
  tagline: "Un sandwich, toujours une bonne idée !",
  items: [
    { name: "Sandwich Oriental", desc: "Baguette, labneh (fromage blanc), tomate, concombre, menthe, olive, salade mixte", price: 3500, tags: ["veg"] },
    { name: "Sandwich au Thon", desc: "Baguette, thon, maïs, cornichon, mayonnaise, salade mixte", price: 4500 },
    { name: "Sandwich Rôti de Bœuf", desc: "Baguette, rôti de bœuf, cornichon, tomate, sauce dijonnaise, salade mixte", price: 4500, photo: "/photos/sandwich-roti-de-boeuf.jpg" },
    { name: "Sandwich Le Parisien", desc: "Panini, jambon, emmental, beurre, salade mixte", price: 4000 },
    { name: "Sandwich Au Poulet", desc: "Baguette, blanc de poulet grillé, salade, tomate, cornichon, sauce aïoli, salade mixte", price: 4500 },
    { name: "Sandwich au Saumon", desc: "Baguette complète, saumon fumé, crème de fromage, citron, câpres, salade mixte", price: 10000, photo: "/photos/sandwich-saumon.jpg" },
  ],
};

const manaiches: Section = {
  id: "manaiches",
  title: "Manaïches",
  items: [
    { name: "Manouché Viande (Lahem Baajine)", desc: "Pâte garnie de viande hachée de mouton, tomate, oignon", price: 3000, photo: "/photos/manouche-viande.jpg" },
    { name: "Manouché Zaatar (Thym)", desc: "Pâte garnie de zaatar (thym), sésame et huile d'olive", price: 1500, tags: ["veg"], photo: "/photos/manouche-zaatar.jpg" },
    { name: "Manouché Fromage", desc: "Pâte garnie d'un mélange de fromages, akawi, mozzarella", price: 4000, tags: ["veg"] },
    { name: "Manouché Fourré", desc: "Manouché zaatar fourré au fromage", price: 5000, tags: ["veg"] },
    { name: "Manouché Sojok et Fromage", desc: "Pâte garnie de sojok, tomate, cornichon, mayonnaise, mozzarella", price: 5000 },
    { name: "Manouché Kebab et Fromage", desc: "Pâte garnie de kebab, tomate, cornichon, mayonnaise, mozzarella", price: 5000, photo: "/photos/manouche-kebab.jpg" },
  ],
};

const crepesSalees: Section = {
  id: "crepes-salees",
  title: "Crêpes Salées",
  tagline: "À tout moment de la journée !",
  items: [
    { name: "Crêpe au Fromage", desc: "Crêpe nature, fromage mozzarella, cheddar", price: 3000, tags: ["veg"] },
    { name: "Crêpe au Jambon Fromage", desc: "Crêpe nature, jambon de bœuf, mozzarella, cheddar", price: 4000, photo: "/photos/crepe-jambon-fromage.jpg" },
    { name: "Crêpe Poulet Béchamel", desc: "Crêpe nature, poulet, champignon, mozzarella, sauce béchamel", price: 5500 },
    { name: "Crêpe Bœuf au Curry et Fromage", desc: "Crêpe nature, filet de bœuf, poivron vert, oignon, carotte, sauce curry, mozzarella", price: 5500, photo: "/photos/crepe-boeuf-curry.jpg" },
    { name: "Crêpe Submarine", desc: "Crêpe nature, pepperoni, jambon de dinde, mozzarella, mayonnaise, moutarde, cornichon", price: 3500, photo: "/photos/crepe-submarine.jpg" },
    { name: "Crêpe Merguez", desc: "Crêpe nature, merguez, oignon, poivron vert, champignon, maïs, mozzarella", price: 3000 },
  ],
};

const crepesSucrees: Section = {
  id: "crepes-sucrees",
  title: "Crêpes Sucrées",
  items: [
    { name: "Crêpe Nature, Sucre Glace", price: 1500, tags: ["veg"] },
    { name: "Crêpe Caramel Beurre Salé", price: 1500, tags: ["veg"] },
    { name: "Crêpe Nutella", price: 3000, tags: ["veg"], photo: "/photos/crepe-nutella.jpg" },
    { name: "Crêpe Trois Chocolats", price: 2000, tags: ["veg"] },
    { name: "Crêpe Chocolat Banane", price: 2500, tags: ["veg"] },
    { name: "Fettucine Trois Chocolats", price: 3000, tags: ["veg"], photo: "/photos/fettucine-trois-chocolats.jpg" },
  ],
};

/* ------------------------------------------------------------------ */
/* Boissons (partagées entre les cartes)                               */
/* ------------------------------------------------------------------ */

const eaux: Section = {
  id: "eaux",
  title: "Eaux Minérales",
  items: [
    { name: "Eau Minérale 0.5L", price: 1000 },
    { name: "Eau Minérale 1.5L", price: 1500 },
  ],
};

const jus: Section = {
  id: "jus",
  title: "Jus",
  items: [
    { name: "Orange Pressée", price: 2000 },
    { name: "Ananas Pressé", price: 2500 },
    { name: "Bissap", price: 1500 },
    { name: "Gingembre", price: 1500 },
  ],
};

const limonades: Section = {
  id: "limonades",
  title: "Limonades",
  items: [
    { name: "Limonade", price: 1500, photo: "/photos/limonades.jpg" },
    { name: "Limonade et Menthe", price: 2000 },
    { name: "Very Berry Limonade", desc: "Baies rouges et limonade", price: 2500 },
    { name: "Limonade et Concombre", price: 2500 },
    { name: "Limonade et Gingembre", price: 2000 },
  ],
};

const smoothies: Section = {
  id: "smoothies",
  title: "Smoothies et Frappés",
  note: "Frappuccino — supplément au choix : caramel, chocolat, framboise ou chantilly 1 000 F",
  items: [
    { name: "Banane et Mangue", price: 2500, photo: "/photos/smoothies.jpg" },
    { name: "Vanillarama", desc: "Vanille, banane et lait", price: 2000 },
    { name: "Milk Shake", desc: "Parfum au choix", price: 2000 },
    { name: "Milk Shake Oreo / Kitkat", price: 3500 },
    { name: "Frappuccino", price: 2500 },
  ],
};

const thesGlaces: Section = {
  id: "thes-glaces",
  title: "Thés Glacés faits maison",
  items: [
    { name: "Ice Tea Gingembre", price: 2500 },
    { name: "Ice Tea Bissap", price: 2500 },
    { name: "Ice Tea Citron", price: 2500 },
    { name: "Ice Tea Fruits Rouges", price: 2500 },
    { name: "Ice Tea Pêche", price: 2500 },
  ],
};

const bubbleTeas: Section = {
  id: "bubble-teas",
  title: "Bubble Teas",
  items: [
    { name: "Bubble Tea Classic", desc: "Thé, lait, kokuto sirop, boba perle", price: 2000, photo: "/photos/bubble-teas.jpg" },
    { name: "Blue Spirulina Bubble Tea", desc: "Thé infusé à la spiruline, lait, kokuto sirop, boba perle", price: 3000 },
    { name: "Purple Taro Bubble Tea", desc: "Thé infusé au taro, lait, kokuto sirop, boba perle", price: 3000 },
    { name: "Cloudy Hibiscus Bubble Tea", desc: "Thé infusé à l'hibiscus, lait, sirop fraise, boba perle", price: 3000 },
    { name: "Choco Bubble Tea", desc: "Lait, sirop de chocolat, boba perle", price: 2500 },
  ],
};

const gazeuses: Section = {
  id: "gazeuses",
  title: "Boissons Gazeuses",
  items: [
    { name: "Coca — Fanta — Sprite", price: 1000 },
    { name: "Lafi Gazeuse 0.5L", price: 1500 },
    { name: "XXL", price: 2000 },
  ],
};

const chaudes: Section = {
  id: "boissons-chaudes",
  title: "Boissons Chaudes",
  items: [
    { name: "Espresso (Illy, Nespresso)", price: 1500 },
    { name: "Double Espresso (Illy, Nespresso)", price: 2500 },
    { name: "Cappuccino", price: 2500 },
    { name: "Nutella Cappuccino", price: 3500 },
    { name: "Café Latte", price: 2500 },
    { name: "Dubai Latte", price: 3000, photo: "/photos/lattes.jpg" },
    { name: "Candy Latte", price: 3000 },
    { name: "Affogato", price: 2500, photo: "/photos/affogato.jpg" },
    { name: "Spanish Latte", price: 3000 },
    { name: "Cookies Mochaccino", price: 3000 },
    { name: "Chocolat Chaud", price: 2000 },
    { name: "Chocolat Chaud Viennois", price: 2500 },
    { name: "Lait Chaud", price: 1500 },
    { name: "Thés et Infusions", price: 2000 },
    { name: "Thé Indien", price: 1500 },
    { name: "Thé Maure", price: 1500 },
  ],
};

const softDrinkSections: Section[] = [eaux, jus, limonades, smoothies, thesGlaces, bubbleTeas, gazeuses, chaudes];

/* ------------------------------------------------------------------ */
/* P'tit Déjeuner                                                      */
/* ------------------------------------------------------------------ */

export const petitDejeuner: Book = {
  id: "dej",
  title: "P'tit Déjeuner",
  subtitle:
    "Un petit-déjeuner sain se compose d'une variété d'éléments combinés ensemble pour donner lieu à un effet harmonieux tout au long de la journée. Passez une bonne journée !",
  hours: "6h30 – 12h30",
  sections: [
    {
      id: "matin-gourmet",
      title: "Matin Gourmet",
      note: "Suppléments : fromage mozzarella 1 500 F · bacon 1 250 F · champignons sautés 1 500 F · légumes sautés 1 000 F",
      items: [
        { name: "Oeuf au Choix", desc: "Omelette ou œuf brouillé ou œuf au plat, pommes de terre croustillantes, tomates rôties, pain artisanal grillé", price: 3500, tags: ["veg"] },
        { name: "Oeuf Bénédicte", desc: "Œufs pochés, pain perdu salé, fromage à la crème, épinards, sauce hollandaise ; accompagnements tomates rôties, pommes de terre croustillantes et salade mixte", price: 5500, tags: ["veg"], photo: "/photos/oeuf-benedicte.jpg" },
        { name: "L'Omelette Maigre Blanc", desc: "Omelette aux blancs d'œufs, champignons rôtis et épinards sur un pain complet, salade de fruits au quinoa", price: 4000, tags: ["veg"] },
        { name: "Croissant Saumon & Oeuf", desc: "Croissant, saumon fumé et œufs pochés, roquette sauce citronnée sur un lit d'avocat écrasé, tomate cerise et sauce hollandaise", price: 8000 },
        { name: "La Crêpe Bombe", desc: "Œufs brouillés, saucisse de poulet fourrés dans une crêpe salée, sauce béchamel, fromage fondu et pommes allumettes", price: 5500 },
        { name: "Omelette au Fromage au Four", desc: "Omelette aux champignons, pommes de terre, tomate, ail, persil, mozzarella ; roquette sauce moutarde citron", price: 3500, tags: ["veg"], photo: "/photos/omelette-au-four.jpg" },
      ],
    },
    {
      id: "tartines",
      title: "Tartines",
      items: [
        { name: "Tartine Rôti de Bœuf", desc: "Pain complet, sauce aïoli, rôti de bœuf, radis, emmental ; accompagnements salade mixte et pommes allumettes", price: 2750 },
        { name: "Tartine en Croque", desc: "Pain complet, dinde, poulet rôti, sauce béchamel, mozzarella et œuf au plat ; accompagnements salade mixte et pommes allumettes", price: 4500 },
        { name: "Tartine Filet de Bœuf et Patate Douce", desc: "Pain complet, filet de bœuf grillé, patates douces écrasées, tomates séchées, oignons marinés, roquette ; accompagnements salade mixte et pommes allumettes", price: 3750, photo: "/photos/tartine-filet-de-boeuf.jpg" },
      ],
    },
    {
      id: "formules",
      title: "Les Formules",
      note: "Au choix — boisson chaude : espresso, thé, chocolat chaud ou lait chaud · viennoiserie : croissant, pain au chocolat ou pain aux raisins · jus de fruits nature : orange, ananas, bissap ou gingembre",
      items: [
        { name: "Formule Express", desc: "Boisson chaude au choix, jus de fruit nature au choix, viennoiserie au choix", price: 3000 },
        { name: "Petit Déjeuner Anglais", desc: "Boisson chaude au choix, jus de fruit nature au choix, œuf au choix, pommes de terre croustillantes, tomates rôties, saucisse de poulet, pain grillé et haricot blanc à la sauce tomate", price: 6500 },
        { name: "Formule Continentale", desc: "Boisson chaude au choix, jus de fruit nature au choix, viennoiserie au choix, beurre et confiture, œuf au choix, pommes de terre croustillantes, tomate rôtie et pain grillé", price: 6000 },
        { name: "Petit Déjeuner Oriental", desc: "Boisson chaude au choix, jus de fruit nature au choix, mini manouché thym, labneh, balila (pois chiches marinés), assiette de légumes, œufs au plat", price: 6000, photo: "/photos/petit-dejeuner-oriental.jpg" },
      ],
    },
    sandwichsFroids,
    manaiches,
    crepesSalees,
    crepesSucrees,
    ...softDrinkSections,
  ],
};

/* ------------------------------------------------------------------ */
/* Déjeuner & Dîner                                                    */
/* ------------------------------------------------------------------ */

export const dejeunerDiner: Book = {
  id: "diner",
  title: "Déjeuner & Dîner",
  subtitle: "Plus qu'une dégustation, l'âme de la papille pour enjouer vos matinées et soirées.",
  hours: "12h – tard",
  sections: [
    {
      id: "entrees",
      title: "Entrées",
      tagline: "Sharing is caring !",
      items: [
        { name: "Assiette de Frites", price: 2000, tags: ["veg"] },
        { name: "Nems à la Viande Hachée", desc: "Galette de riz, viande hachée, gingembre, sauce asiatique", price: 4000, photo: "/photos/nems.jpg" },
        { name: "Crevettes Dynamite", desc: "Crevettes frites arrosées de sauce dynamite, feuilles de riz croquantes, sauce mangue aïoli", price: 8500, tags: ["spicy"] },
        { name: "Frites De Calamar", desc: "Calamars panés frits et croustillants, sauce tartare", price: 6500 },
        { name: "Nachos Con Carne", desc: "Nachos chips fait maison, viande hachée braisée, sauce tomate, haricot rouge, jalapeño, mozzarella, cheddar, guacamole", price: 4500, photo: "/photos/nachos.jpg" },
        { name: "Mozzarella Sticks", desc: "Mozzarella panée aux herbes, sauce marinara", price: 5500, tags: ["veg"] },
        { name: "Rouleaux de Printemps", desc: "Feuille de riz farcie de quinoa, carotte, mangue, salade, avocat, sauce soja, betteraves allumettes", price: 3500, tags: ["house", "veg"] },
        { name: "Pains à l'Ail et au Fromage", desc: "Baguette tranchée, crème à l'ail, mozzarella, sauce tomate", price: 3000, tags: ["veg"] },
        { name: "Saucisses de Poulet Pané", desc: "Saucisses de poulet pané tempura, moutarde, ketchup, sauce cheddar, pommes allumettes", price: 3500 },
        { name: "Mille-Feuilles au Merguez", desc: "Mille-feuille frit de merguez de porc, sauce asiatique, sauce aïoli à la mangue", price: 4500, photo: "/photos/mille-feuilles-merguez.jpg" },
        { name: "Fruits De Mer Potsticker", desc: "Galette de riz frite, farcie de calamars, crevettes, capitaines, sauce aïoli à la mangue", price: 5000, tags: ["house"], photo: "/photos/potsticker.jpg" },
      ],
    },
    {
      id: "salades",
      title: "Salades",
      tagline: "Up for a salad ?",
      items: [
        { name: "Salade Maison", desc: "Salade, concombre, tomate, oignon, poivron vert, sauce moutarde citron", price: 3500, tags: ["veg"] },
        { name: "Salade Crétoise", desc: "Salade, betterave, roquette, tomate cerise, concombre, radis, pané d'aubergines à la feta, pois chiches, vinaigrette citron", price: 4500, tags: ["veg"] },
        { name: "SAP-SAP Poulet Salade", desc: "Salade, tomate cerise, avocat, blanc de poulet grillé, jambon, fromage, œuf dur, arachide, pomme, parmesan, sauce César", price: 6500, photo: "/photos/sap-sap-salade.jpg" },
        { name: "Le Buddha Bowl", desc: "Salade, épinard, avocat, pois chiches, tomate cerise, concombre, betterave, radis, haricot, sésame noir, feta, artichaut, acajou grillé, vinaigrette citron", price: 4500, tags: ["house", "veg"] },
        { name: "Salade de Pâtes au Thon", desc: "Salade, pâtes, concombre, olive, tomate, maïs, thon, œuf dur, sauce moutarde citron", price: 6000 },
        { name: "Salade de Crabe Majestic", desc: "Salade, bâtonnet de crabe à la sauce spéciale, roquette, tomate cerise, épis de maïs, sésame blanc, sésame noir, sauce balsamique", price: 6000, tags: ["house"] },
        { name: "Salade de Bœuf Grillé à la Thaïlandaise", desc: "Salade, filet de bœuf sauté, quinoa, arachide, concombre, acajou, oignon rouge, tomate cerise, haricot vert, roquette, coriandre, amande, épis de maïs, pommes allumettes, vinaigrette à la tomate", price: 7500, photo: "/photos/salade-boeuf-thai.jpg" },
        { name: "Feta chaud au Quinoa & Betterave", desc: "Salade, roquette, avocat, quinoa, lentille, concombre, betterave, oignons marinés, sésame blanc, sésame noir, tomate cerise, tomate séchée, crème de feta, amande effilée, sauce moutarde citron", price: 6500, tags: ["house", "veg"], photo: "/photos/feta-quinoa-betterave.jpg" },
        { name: "Croustillant de Poulet en Croûte de Noix", desc: "Salade, poulet pané aux noix, roquette, avocat, tomate cerise, lardon de porc croustillant, emmental, concombre, arachide, sauce moutarde citron", price: 6500, tags: ["house"] },
        { name: "Salade Fattouche", desc: "Salade, concombre, tomate, oignon, radis, sumac, mélasse de grenade, pain libanais frit, sauce fattouche", price: 4000, tags: ["veg"] },
        { name: "Salade César au Poulet", desc: "Salade, blanc de poulet grillé, parmesan, croûtons, sauce César", price: 5750 },
        { name: "Salade Mexicaine au Poulet", desc: "Salade, tortilla, blanc de poulet grillé, haricot rouge, cheddar, maïs, avocat, tomate, concombre, jalapeños, sauce moutarde citron", price: 8000, tags: ["house"] },
        { name: "Salade Tortellini à la Toscane", desc: "Tortellini fait maison farcie de champignons, pommes de terre et mozzarella ; salade, épinard, tomate séchée, tomate cerise, parmesan, concombre, pepperoni, sauce balsamique", price: 8000, tags: ["house", "veg"], photo: "/photos/salade-tortellini.jpg" },
      ],
    },
    sandwichsFroids,
    manaiches,
    {
      id: "sandwichs-chauds",
      title: "Sandwichs Chauds",
      tagline: "Life is too short for a bad sandwich !",
      items: [
        { name: "Trio de Tacos", desc: "3 pains tortillas, poulet croustillant, steak poêlé, crevettes panées, cheddar, chips alloco", price: 6500, tags: ["house"] },
        { name: "Panini Caprese", desc: "Panini, sauce pesto, blanc de poulet grillé, mozzarella, tomate, frites", price: 5500 },
        { name: "Quesadillas au Poulet", desc: "Tortilla, poulet cajun, poivron vert, oignon, ail, fromage fondant, chips alloco, purée d'avocat", price: 8500, photo: "/photos/quesadillas.jpg" },
        { name: "Poitrine de Bœuf de 48H", desc: "Pain ciabatta, bœuf mijoté 48 heures, coleslaw aux pommes, oignons marinés croustillants, mozzarella, salade de pommes de terre, chips de betterave", price: 8000, tags: ["house"], photo: "/photos/poitrine-de-boeuf-48h.jpg" },
        { name: "Poulet Sandos", desc: "Pain de mie, poulet croustillant, sauce russe, laitue, dinde, cheddar, frites, cornichons, sauce dynamite", price: 7000, tags: ["house"] },
        { name: "Wrap de Crevettes", desc: "Tortilla, crevettes sauce asiatique, sauce aïoli, cornichon, maïs, salade, pommes allumettes, salade de pommes de terre, chips de betteraves", price: 9500 },
        { name: "Wrap Poulet BBQ", desc: "Tortilla, poulet pané, sauce BBQ mayonnaise, jalapeño, cheddar, pommes frites", price: 8500 },
        { name: "Ranchero au Poulet", desc: "Submarine, blanc de poulet sauté, maïs, champignon, poivron, jalapeño, sauce BBQ, mozzarella, sauce russe, pommes frites", price: 8500, photo: "/photos/ranchero.jpg" },
        { name: "Phili Steak au Fromage", desc: "Submarine, bœuf sauté, oignon, poivron vert, champignon, mozzarella, frites", price: 7500 },
        { name: "Sandwich Chawarma au Bœuf", desc: "Pain libanais, bœuf chawarma poêlé, cornichon, sauce sésame, biwaz (tomate, persil, oignon, sumac)", price: 3500 },
        { name: "Sandwich Chawarma au Poulet", desc: "Pain libanais, poulet chawarma poêlé, cornichon, crème à l'ail, salade", price: 3500, photo: "/photos/chawarma-poulet.jpg" },
      ],
    },
    {
      id: "burgers",
      title: "Burgers Gourmands",
      tagline: "A burger a day keeps the hunger away !",
      items: [
        { name: "TRIO Sliders", desc: "Bœuf effiloché et purée d'avocats, poulet croustillant sauce buffalo, burger de bœuf sauce aïoli", price: 4000, tags: ["house"] },
        { name: "Burger Classic", desc: "Entrecôte hachée, salade, tomate, cornichon, sauce maison, frites", price: 6000 },
        { name: "Double Burger", desc: "Double viandes, salade, tomate, cornichon, sauce maison, frites", price: 8500 },
        { name: "Cheeseburger", desc: "Entrecôte hachée, salade, tomate, cornichon, sauce cheddar, sauce maison, frites", price: 7000 },
        { name: "Double Cheeseburger", desc: "Double viandes, salade, tomate, cornichon, cheddar, sauce maison, frites", price: 9000 },
        { name: "Cheezy Pizza Burger", desc: "Entrecôte hachée, salade, tomate, oignon grillé, sauce pizza, champignon, pepperoni, mozzarella, frites", price: 8750, tags: ["house"], photo: "/photos/cheezy-pizza-burger.jpg" },
        { name: "Swiss Burger", desc: "Entrecôte hachée, champignons rôtis et sautés, sauce bœuf crémeuse, oignons caramélisés, cornichon, mayonnaise, fromage suisse, frites", price: 8500 },
        { name: "Cordon Bleu Burger", desc: "Frit de blanc de poulet fourré aux champignons, dinde fumée et mozzarella ; salade, cornichon, tomate, sauce aïoli, sauce cheddar, frites", price: 7000, tags: ["house"] },
        { name: "Nashville Burger", desc: "Poulet pané croustillant, sauce aïoli, salade de chou asiatique, tomate, cornichon, sauce sriracha, frites", price: 7500, tags: ["house", "spicy"] },
        { name: "Kebab Burger", desc: "Kebab, sauce tomate piquante, cornichon, tomate, salade, biwaz (tomate, oignons, persil, sumac), frites", price: 6000 },
        { name: "Fit Chicken Burger", desc: "Pain burger aux céréales, poulet grillé, roquette, avocat écrasé, cornichon, tomate, salade mixte", price: 6000 },
        { name: "Mac & Cheese Burger", desc: "Entrecôte hachée, mac & cheese pané, sauce BBQ aïoli, cheddar, salade, tomate, jalapeños, frites", price: 7500, tags: ["house"], photo: "/photos/mac-and-cheese-burger.jpg" },
        { name: "Ribs BBQ Burger", desc: "Ribs de porc, salade de chou, sauce BBQ, oignon caramélisé, frites", price: 8000, tags: ["house"], photo: "/photos/ribs-bbq-burger.jpg" },
      ],
    },
    {
      id: "pates",
      title: "Pâtes",
      tagline: "« Tout ce que vous voyez, je le dois aux spaghettis ! » — Sophia Loren",
      items: [
        { name: "Spaghetti Bolognaise", desc: "Spaghetti, sauce bolognaise crémeuse, parmesan râpé, basilic frit", price: 6000 },
        { name: "Stylish Bolognaise", desc: "Spaghetti bolognaise au fromage panée et frit, sauce à la crème, sauce salsa aux olives, parmesan", price: 8500, tags: ["house"], photo: "/photos/stylish-bolognaise.jpg" },
        { name: "Buffalo Mac & Cheese", desc: "Serpentini, sauce crémeuse au cheddar, mozzarella, poulet croustillant au sriracha buffalo", price: 8500, tags: ["house", "spicy"] },
        { name: "Pâtes Rosées au Bœuf", desc: "Rigatoni, filet de bœuf sauté au vin rouge, sauce crémeuse au poivron rouge, petits pois, carotte, champignon, parmesan, basilic frit", price: 8500, tags: ["house"] },
        { name: "Fusilli au Poulet Sauce Pesto", desc: "Fusilli, blanc de poulet sauté au beurre, pesto à la crème, tomate cerise, parmesan", price: 8000 },
        { name: "Poulet Milanais au Citron Crémeux", desc: "Spaghetti, épinard, sauce crémeuse, blanc de poulet en croûte de noix, parmesan, champignon, amande effilée", price: 7500, tags: ["house"], photo: "/photos/poulet-milanais.jpg" },
        { name: "Crevettes En Rose", desc: "Fusilli au four, sauce rosée, crevette, tomate cerise, mozzarella", price: 11000 },
        { name: "Tortellini aux Fruits de Mer", desc: "Tortellini fait maison farci de champignon, sauté de fruits de mer et tomate cerise, sauce crème, sauce bisque, parmesan", price: 9500, tags: ["house"], photo: "/photos/tortellini-fruits-de-mer.jpg" },
        { name: "Lasagne à la Viande", desc: "Lasagne, sauce bolognaise, mozzarella, parmesan, sauce béchamel", price: 8000 },
        { name: "Ravioli de Betterave aux 4 Fromages", desc: "Ravioli fait maison farcis d'épinard et fromage, champignon, sauce quatre fromages", price: 11000, tags: ["house", "veg"], photo: "/photos/ravioli-betterave.jpg" },
      ],
    },
    {
      id: "pizzas",
      title: "Pizzas",
      tagline: "In crust we trust !",
      dual: "Moyenne / Grande",
      items: [
        { name: "Margherita", desc: "Sauce tomate, fromage mozzarella, basilic", price: [3900, 4900], tags: ["veg"] },
        { name: "Végétarienne", desc: "Sauce tomate, oignon, poivron vert, tomate fraîche, champignon, mozzarella", price: [4500, 6500], tags: ["veg"], photo: "/photos/pizza-vegetarienne.jpg" },
        { name: "Quatre Fromages", desc: "Sauce béchamel, mozzarella, emmental, roquefort, parmesan", price: [5500, 6900], tags: ["veg"] },
        { name: "Kebab", desc: "Sauce tomate, viande hachée de bœuf, tomate, oignon, poivron vert, mozzarella, œuf", price: [5500, 7500] },
        { name: "Quatre Saisons", desc: "Sauce tomate, champignon, cœur d'artichaut, jambon, olive, mozzarella", price: [5900, 7900] },
        { name: "Royale", desc: "Sauce tomate, jambon, champignon, mozzarella, parmesan", price: [4900, 6900] },
        { name: "Pepperoni", desc: "Sauce tomate, pepperoni, mozzarella", price: [5000, 6500], photo: "/photos/pizza-pepperoni.jpg" },
        { name: "Poulet Alfredo", desc: "Sauce Alfredo, champignon, oignon caramélisé, blanc de poulet grillé, mozzarella", price: 8500, photo: "/photos/pizza-poulet-alfredo.jpg" },
        { name: "La Carnivore", desc: "Sauce trempette aux artichauts et épinards, mozzarella, champignon, oignon sauté, steak poêlé", price: 9500 },
        { name: "Poulet César", desc: "Sauce César, tranche de blanc de poulet grillé, mozzarella, laitue", price: 8000 },
        { name: "Saumon Fumé", desc: "Sauce fromage, saumon fumé, câpre, aneth, citron", price: 11500 },
        { name: "Fruits de Mer", desc: "Sauce tomate, mix de fruits de mer, filet de capitaine, câpre, mozzarella", price: 10500, photo: "/photos/pizza-fruits-de-mer.jpg" },
      ],
    },
    {
      id: "plats-chauds",
      title: "Plats Chauds",
      tagline: "Prêt pour un voyage culinaire ?",
      note: "Sauce au choix : asiatique, sriracha, tomate épicée, tomate, champignon, à l'ancienne, bisque, beurre citron, curry, vin rouge · Accompagnement au choix : frites, salade verte, riz blanc, purée de pommes de terre, légumes sautés, attiéké, lentilles pilaf, alloco, pommes de terre sautées, spaghetti nature",
      items: [
        { name: "Blanc de Poulet à l'Ancienne", desc: "Blanc de poulet grillé, sauce crémeuse à l'ancienne, légumes sautés, accompagnement au choix", price: 8000 },
        { name: "Poulet Wellington", desc: "Cuisse de poulet farcie de champignons, épinards et bacon de porc cuit au four dans une pâte feuilletée, sauce vin rouge, purée de pommes de terre, champignons et épinards sautés", price: 10500, photo: "/photos/poulet-wellington.jpg" },
        { name: "Poulet Curry", desc: "Poulet mariné au curry, légumes sautés, sauce crème au curry, riz basmati, allumettes d'aubergines croustillantes", price: 7000 },
        { name: "Poulet Local Farci au Riz", desc: "Poulet local rôti farci de riz aux légumes, sauce tomate épicée", price: 12000 },
        { name: "Riz Cantonais au Poulet", desc: "Poulet sauté aux oignons, carotte, chou blanc, sauce asiatique et riz cantonais", price: 6000, photo: "/photos/riz-cantonais.jpg" },
        { name: "Riz Cantonais au Bœuf", desc: "Bœuf sauté aux oignons, carotte, chou blanc, sauce asiatique et riz cantonais", price: 7000 },
        { name: "Bœuf à la Milanaise", desc: "Entrecôte de bœuf panée, spaghetti arrabbiata, parmesan", price: 9000, tags: ["house"], photo: "/photos/boeuf-milanaise.jpg" },
        { name: "Côte de Bœuf Braisée", desc: "Côte de bœuf mijotée sauce Paléo, purée de pommes de terre au pesto, légumes sautés", price: 10000, tags: ["house"] },
        { name: "Entrecôte de Bœuf", desc: "Entrecôte poêlée, purée de pommes de terre à l'ail rôti, légumes sautés, chimichurri, sauce aux champignons", price: 9500 },
        { name: "Médaillons de Filet Mignon", desc: "Médaillons de filet mignon, sauce et accompagnement au choix", price: 8500 },
        { name: "Gigot d'Agneau Royal", desc: "Gigot de mouton, purée de patate douce et betterave, sauce au choix, légumes sautés", price: 8500, tags: ["house"] },
        { name: "Tchep d'Agneau au Riz Soumbala", desc: "Viande de mouton aux carottes, chou blanc, oignon, gingembre, sauce tomate, riz soumbala, allumettes d'aubergines croustillantes", price: 8000, tags: ["house"] },
        { name: "Filet de Capitaine Grillé", desc: "Filet de capitaine grillé, sauce et accompagnement au choix", price: 9500 },
        { name: "Filet de Saumon Grillé", desc: "Filet de saumon grillé, légumes sautés, purée de pommes de terre, sauce asiatique", price: 18500 },
        { name: "Croquettes de Capitaine", desc: "Croquettes de capitaine pané, salade de chou, sauce tartare, frites", price: 9500 },
        { name: "Pork Ribs et Merguez", desc: "Poitrine de porc cuisson lente, 2 types de merguez, patates douces grillées, salade de chou, sauce au choix", price: 9500, tags: ["house"], photo: "/photos/pork-ribs-merguez.jpg" },
        { name: "Pork Chops", desc: "Entrecôte de porc grillée, purée de pommes de terre, sauce au choix, carottes caramélisées, accompagnement au choix", price: 10500, tags: ["house"] },
      ],
    },
    {
      id: "char-grill",
      title: "Char-Grill et Chawarma",
      tagline: "Tout feu tout flamme jusqu'à vos assiettes",
      items: [
        { name: "Brochettes de Capitaine", desc: "Brochettes de filet de capitaine, sauce et accompagnement au choix", price: 9500, photo: "/photos/brochettes.jpg" },
        { name: "Brochettes de Bœuf", desc: "Brochettes de bœuf, sauce et accompagnement au choix", price: 8500 },
        { name: "Brochettes de Poulet", desc: "Brochettes de poulet mariné, crème à l'ail, accompagnement au choix", price: 8750 },
        { name: "Brochettes Mixtes", desc: "Brochettes de capitaine, brochettes de viande, brochettes de poulet, crème à l'ail, accompagnement au choix", price: 11500 },
        { name: "Assiette Chawarma au Bœuf", desc: "Pain arabe, chawarma bœuf, cornichon, sauce sésame, biwaz (tomate, persil, oignon, sumac), frites", price: 8000, photo: "/photos/assiette-chawarma-boeuf.jpg" },
        { name: "Assiette Chawarma au Poulet", desc: "Pain arabe, chawarma poulet, cornichon, crème à l'ail, salade, frites", price: 8000, photo: "/photos/assiette-chawarma-poulet.jpg" },
      ],
    },
    {
      id: "bon-poulet",
      title: "Le Bon Poulet",
      tagline: "Poulet broasted, croustillant comme il faut",
      gallery: ["/photos/tenders.jpg", "/photos/ailes-de-poulet.jpg", "/photos/nuggets.jpg"],
      note: "Supplément sauces : sauce piquante 750 F · moutarde au miel 750 F · BBQ sauce 750 F",
      items: [
        { name: "Poutine au Poulet", price: 6500, photo: "/photos/poutine.jpg" },
        { name: "Patate Douce au Poulet BBQ", price: 6000, photo: "/photos/patate-douce-poulet-bbq.jpg" },
        { name: "Combo Pour 2 Personnes", desc: "2 pcs tenders panés, 2 pcs cuisses panées, 2 pcs ailes de poulet panées, 4 pcs chicken nuggets, 2 sauces au choix, 4 minis pains et 2 sodas au choix", price: 14000, photo: "/photos/combo-2-personnes.jpg" },
        { name: "Poulet Entier Broasted", desc: "Poulet broasted, pommes de terre frites fait maison, cornichon, sauce russe", price: 17000, photo: "/photos/poulet-broasted.jpg" },
      ],
    },
    {
      id: "menu-enfant",
      title: "Menu Enfant",
      items: [
        { name: "Mini Bâtonnets de Poulet Pané et Frites", price: 4000 },
        { name: "Duo Mini Burger Bœuf et Poulet, Frites", price: 3500 },
        { name: "Fusilli Sauce Tomate", price: 4000, tags: ["veg"] },
        { name: "Steak et Frites", price: 4000 },
      ],
    },
    crepesSalees,
    crepesSucrees,
    {
      id: "desserts",
      title: "Desserts",
      tagline: "Irrésistiblement délicieux ! Le meilleur pour la fin",
      items: [
        { name: "Moelleux au Chocolat", desc: "Gâteau cœur fondant au chocolat, boule de glace vanille", price: 2500, tags: ["veg"] },
        { name: "Salade de Fruits de Saison", price: 2500, tags: ["veg"], photo: "/photos/salade-de-fruits.jpg" },
        { name: "Pain Perdu Tropical", desc: "Pain brioché trempé dans un mélange d'œufs et de lait, toasté au beurre, fruits de saison, sauce caramel, boule de glace vanille", price: 3500, tags: ["veg"], photo: "/photos/pain-perdu-tropical.jpg" },
        { name: "Profiterole", desc: "Pâte à choux, glace à la vanille, sauce chocolat et caramel, brisures de sablé", price: 3000, tags: ["veg"], photo: "/photos/profiterole.jpg" },
        { name: "Brownies", desc: "Brownies, boule de glace vanille, sauce chocolat", price: 3500, tags: ["veg"], photo: "/photos/brownies.jpg" },
      ],
    },
    ...softDrinkSections,
  ],
};

/* ------------------------------------------------------------------ */
/* Bar & Cave                                                          */
/* ------------------------------------------------------------------ */

export const barCave: Book = {
  id: "bar",
  title: "Bar & Cave",
  subtitle: "Cocktails signature, bières fraîches et une cave de Bordeaux.",
  hours: "Déjeuner & soirée",
  sections: [
    {
      id: "cocktails",
      title: "Cocktails Alcoolisés",
      items: [
        { name: "Marguarita", desc: "Tequila, jus de citron, triple sec", price: 5000 },
        { name: "Piña Colada", desc: "Rhum blanc, crème de coco, jus d'ananas", price: 5000 },
        { name: "Mojito", desc: "Feuilles de menthe, jus de citron, sucre de canne, rhum blanc, schweppes, sucre brun", price: 5000 },
        { name: "Moscow Mule", desc: "Vodka, jus de citron, bière de gingembre", price: 5000 },
        { name: "Lunch Burg Limonade", desc: "Jack Daniel's, triple sec, jus de citron, soda", price: 5000 },
        { name: "Blue Lagoon", desc: "Blue curaçao, vodka, jus de citron, jus d'orange, soda", price: 5000 },
        { name: "Jager-Bomb", desc: "Jägermeister, coca-cola", price: 5000 },
        { name: "Jack & Coke", desc: "Jack Daniel's, coca-cola", price: 5000 },
        { name: "White Russian", desc: "Vodka, kahlúa, crème chantilly", price: 6000 },
        { name: "Aperol Spritz", desc: "Prosecco, aperol, soda", price: 7000, photo: "/photos/aperol-spritz.jpg" },
        { name: "Espresso Martini", desc: "Vodka, kahlúa, espresso", price: 5000, photo: "/photos/espresso-martini.jpg" },
        { name: "Spicy MAMArita", desc: "Triple sec, jus de citron, tequila silver, jalapeño, gingembre, sucre de canne", price: 5000, tags: ["spicy"] },
        { name: "Blue Marguarita", desc: "Tequila silver, blue curaçao, jus de citron, sel bleu", price: 5000, photo: "/photos/blue-marguarita.jpg" },
        { name: "Hibiscus Gin Sour", desc: "Gin rose, sirop hibiscus, sucre de canne, jus de citron", price: 5000 },
      ],
    },
    {
      id: "mocktails",
      title: "Mocktails",
      items: [
        { name: "Virgin Mojito", desc: "Feuilles de menthe, jus de citron, sucre de canne, schweppes, sucre brun", price: 3000 },
        { name: "Bob Marley", desc: "Jus de mangue, sirop de grenadine, sirop de kiwi, sprite", price: 3000 },
        { name: "Mojito Fraise", desc: "Feuilles de menthe, jus de citron, sirop de sucre, sirop de fraise, schweppes, sucre brun", price: 3000 },
        { name: "Sunrise", desc: "Jus d'ananas, jus d'orange, jus de mangue, jus de citron, sirop de grenadine", price: 3000 },
        { name: "Anaïs", desc: "Jus d'ananas, jus de gingembre, jus d'orange, menthe", price: 3000 },
        { name: "Spécial P'tit Paris", desc: "Jus d'ananas, jus d'orange, crème fraîche, sirop de menthe", price: 3000, tags: ["house"] },
      ],
    },
    {
      id: "bieres",
      title: "Bières",
      items: [
        { name: "Castel 0.33L", price: 1500 },
        { name: "Beaufort 0.33L", price: 1500 },
        { name: "Guinness 0.33L", price: 2000 },
        { name: "Malta Guinness 0.33L", price: 1500 },
        { name: "Brakina 0.65L", price: 2000 },
        { name: "Beaufort 0.65L", price: 2000 },
        { name: "Bière à Pression 0.3L", price: 1500 },
        { name: "Bière à Pression 0.5L", price: 2000 },
      ],
    },
    {
      id: "liqueurs",
      title: "Liqueurs",
      items: [
        { name: "Apéritifs", price: 3000 },
        { name: "Liqueurs", price: 4000 },
        { name: "Gin", price: 5000 },
        { name: "Vodka", price: 6000 },
        { name: "Tequila", price: 4000 },
        { name: "Rhum", price: 4500 },
        { name: "Cognac", price: 7000 },
      ],
    },
    {
      id: "whisky",
      title: "Whisky",
      dual: "Verre / Bouteille",
      items: [
        { name: "JW Red Label", price: [4000, 45000] },
        { name: "JW Black Label", price: [6000, 65000] },
        { name: "Jack Daniel's", price: [5000, 55000] },
        { name: "JW Double Black", price: [8000, 85000] },
        { name: "Chivas Regal", price: [6000, 65000] },
      ],
    },
    {
      id: "bulles",
      title: "Prosecco & Champagne",
      items: [
        { name: "Prosecco Brut", price: 35000 },
        { name: "Prosecco Rosé", price: 37500 },
        { name: "Pommery Royal", price: 85000 },
        { name: "Moët & Chandon Brut Impérial", price: 75000 },
        { name: "Moët & Chandon Ice Demi-Sec", price: 90000 },
      ],
    },
    {
      id: "vins-blancs",
      title: "Vins Blancs",
      items: [
        { name: "Maison Castel Chardonnay — 18,7 cl", price: 6000 },
        { name: "Bordeaux Baron de Lestac 2019 — 75 cl", price: 16500 },
        { name: "Bordeaux Baron de Lestac Moelleux 2017 — 75 cl", price: 20000 },
        { name: "Chardonnay Grande Réserve 2018 — 75 cl", price: 20000 },
        { name: "Graves Château Ferrande 2015 — 75 cl", price: 30000 },
      ],
    },
    {
      id: "vins-roses",
      title: "Vins Rosés",
      items: [
        { name: "Maison Castel Merlot Rosé — 18,7 cl", price: 6000 },
        { name: "Vieux Pape Rosé Moelleux — 75 cl", price: 15000 },
        { name: "Merlot Rosé 2019 — 75 cl", price: 16500 },
      ],
    },
    {
      id: "vins-rouges",
      title: "Vins Rouges",
      items: [
        { name: "Maison Castel Merlot — 18,7 cl", price: 6000 },
        { name: "Maison Castel Cabernet Sauvignon — 18,7 cl", price: 6000 },
        { name: "Merlot 2019 — 75 cl", price: 16500 },
        { name: "Cabernet Sauvignon 2019 — 75 cl", price: 16500 },
        { name: "Bordeaux Cru de la Maqueline 2018 — 75 cl", price: 20000 },
        { name: "Bordeaux Château du Lort 2012 — 75 cl", price: 30000 },
        { name: "Haut-Médoc Cru Bourgeois Château d'Arcins 2013/2014 — 75 cl", price: 45000 },
        { name: "Château La Croix Montlabert 2011/2014 — 75 cl", price: 55000 },
      ],
    },
  ],
};

export const books: Book[] = [petitDejeuner, dejeunerDiner, barCave];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatPrice(p: number | [number, number]): string {
  const f = (n: number) => n.toLocaleString("fr-FR").replace(/[\u202f\u00a0]/g, " ") + " F";
  return Array.isArray(p) ? `${f(p[0])} / ${f(p[1])}` : f(p);
}

export const BOOK_IDS: Book["id"][] = ["dej", "diner", "bar"];
export const BOOK_META: Record<Book["id"], { title: string; subtitle: string; hours: string }> = {
  dej: { title: petitDejeuner.title, subtitle: petitDejeuner.subtitle, hours: petitDejeuner.hours },
  diner: { title: dejeunerDiner.title, subtitle: dejeunerDiner.subtitle, hours: dejeunerDiner.hours },
  bar: { title: barCave.title, subtitle: barCave.subtitle, hours: barCave.hours },
};

/* ------------------------------------------------------------------ */
/* Carte en base (éditable depuis /admin)                              */
/* ------------------------------------------------------------------ */

export type DbItem = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  price2: number | null;
  tags: string[];
  photo: string | null;
  position: number;
  available: boolean;
  visible: boolean;
};

export type DbSection = {
  id: string;
  books: Book["id"][];
  title: string;
  tagline: string | null;
  note: string | null;
  dual: string | null;
  gallery: string[];
  position: number;
  visible: boolean;
  items: DbItem[];
};

/** Construit les trois cartes affichées à partir des rubriques en base (rubriques et plats masqués exclus). */
export function booksFromSections(sections: DbSection[]): Book[] {
  return BOOK_IDS.map((id) => ({
    id,
    ...BOOK_META[id],
    sections: sections
      .filter((s) => s.visible && s.books.includes(id))
      .sort((a, b) => a.position - b.position)
      .map<Section>((s) => ({
        id: s.id,
        title: s.title,
        tagline: s.tagline ?? undefined,
        note: s.note ?? undefined,
        dual: s.dual ?? undefined,
        gallery: s.gallery?.length ? s.gallery : undefined,
        items: s.items
          .filter((i) => i.visible)
          .sort((a, b) => a.position - b.position)
          .map<Item>((i) => ({
            id: i.id,
            slug: i.slug,
            name: i.name,
            desc: i.description ?? undefined,
            price: i.price2 != null ? ([i.price, i.price2] as [number, number]) : i.price,
            tags: i.tags.length ? (i.tags as Tag[]) : undefined,
            photo: i.photo ?? undefined,
            available: i.available,
          })),
      }))
      .filter((s) => s.items.length > 0),
  }));
}

/** La carte imprimée sous forme de rubriques base, pour l'amorçage et le mode bac à sable. */
export function seedSections(): DbSection[] {
  const out = new Map<string, DbSection>();
  const seenSlugs = new Set<string>();
  let pos = 0;
  for (const b of books) {
    for (const s of b.sections) {
      let sec = out.get(s.id);
      if (!sec) {
        sec = { id: s.id, books: [], title: s.title, tagline: s.tagline ?? null, note: s.note ?? null, dual: s.dual ?? null, gallery: s.gallery ?? [], position: pos++, visible: true, items: [] };
        out.set(s.id, sec);
      }
      if (!sec.books.includes(b.id)) sec.books.push(b.id);
      for (const it of s.items) {
        const slug = slugify(it.name);
        if (seenSlugs.has(slug)) continue;
        seenSlugs.add(slug);
        sec.items.push({
          id: `seed-${slug}`,
          slug,
          name: it.name,
          description: it.desc ?? null,
          price: Array.isArray(it.price) ? it.price[0] : it.price,
          price2: Array.isArray(it.price) ? it.price[1] : null,
          tags: it.tags ?? [],
          photo: it.photo ?? null,
          position: sec.items.length,
          available: true,
          visible: true,
        });
      }
    }
  }
  return [...out.values()];
}

export type FlatItem = Item & {
  slug: string;
  sectionId: string;
  sectionTitle: string;
  bookId: Book["id"];
  bookTitle: string;
};

/** Tous les plats d'un jeu de cartes, dédupliqués par slug (les rubriques partagées apparaissent une seule fois). */
export function allItems(source: Book[]): FlatItem[] {
  const seen = new Set<string>();
  const out: FlatItem[] = [];
  for (const book of source) {
    for (const section of book.sections) {
      for (const item of section.items) {
        const slug = item.slug ?? slugify(item.name);
        if (seen.has(slug)) continue;
        seen.add(slug);
        out.push({ ...item, slug, sectionId: section.id, sectionTitle: section.title, bookId: book.id, bookTitle: book.title });
      }
    }
  }
  return out;
}

export function findItem(source: Book[], slug: string): FlatItem | undefined {
  return allItems(source).find((i) => i.slug === slug);
}

/** Plats mis en avant (spécialités maison avec photo, disponibles). */
export function signatureItems(source: Book[]): FlatItem[] {
  return allItems(source).filter((i) => i.photo && i.tags?.includes("house") && i.available !== false);
}

/** Texte compact de la carte pour le sommelier IA (plats en rupture exclus). */
export function menuAsText(source: Book[]): string {
  const lines: string[] = [];
  for (const book of source) {
    lines.push(`# ${book.title} (${book.hours})`);
    for (const section of book.sections) {
      lines.push(`## ${section.title}${section.dual ? ` (${section.dual})` : ""}`);
      if (section.note) lines.push(`(${section.note})`);
      for (const it of section.items) {
        if (it.available === false) continue;
        const tags = it.tags?.map((t) => TAG_LABEL[t].label).join(", ");
        lines.push(`- ${it.name} — ${formatPrice(it.price)}${it.desc ? ` : ${it.desc}` : ""}${tags ? ` [${tags}]` : ""}`);
      }
    }
  }
  return lines.join("\n");
}

/** Résout une ligne de panier « slug » ou « slug:0 / slug:1 » vers un plat et son prix serveur. */
export function resolveCartKey(source: Book[], key: string): { item: FlatItem; price: number; label: string } | null {
  const [slug, v] = key.split(":");
  const item = findItem(source, slug);
  if (!item || item.available === false) return null;
  if (Array.isArray(item.price)) {
    const idx = v === "1" ? 1 : 0;
    const section = source.flatMap((b) => b.sections).find((s) => s.id === item.sectionId);
    const labels = (section?.dual ?? "Moyenne / Grande").split("/").map((x) => x.trim());
    return { item, price: item.price[idx], label: `${item.name} (${labels[idx] ?? ""})`.trim() };
  }
  if (v) return null;
  return { item, price: item.price, label: item.name };
}

/** Rubriques commandables à table, dans l'ordre de service, sans doublon. */
export function orderableSections(source: Book[]): { book: Book; section: Section }[] {
  const seen = new Set<string>();
  const out: { book: Book; section: Section }[] = [];
  for (const book of source)
    for (const section of book.sections) {
      if (seen.has(section.id)) continue;
      seen.add(section.id);
      out.push({ book, section });
    }
  return out;
}
