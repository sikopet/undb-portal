define (['app'],function (){
var champs = [
  {
    name: 'India',
    rank: 1,
    date: "2012-10-16",
    imgURL: "https://www.cbd.int/images/flags/64/flag-in-64.png",
    link: "/actions/country/in",
    countryCode: "IN",
    aichiTargets: "All",
    pledge: "<b>US$&nbsp;50 Million</b>for India and developing countries pledged by <b>Dr. Manmohan Singh</b>, <b>Prime Minister of India</b>, at the inauguration of the High-Level Segment of <a href=\"https://www.cbd.int/cop11/\">COP&nbsp;11</a><a  href=\"https://www.cbd.int/doc/speech/2012/sp-2012-10-16-cop11-hls-in-pm-en.pdf\">View the Prime Minister's speech</a>"
  }, {
    name: "FICCI",
    rank: 2,
    date: "2012-11-09",
    imgURL: "https://www.cbd.int/images/champions/ficci-64.jpg",
    link: "http://ficci.in",
    aichiTargets: "All",
    pledge: "<a href='http://www.ficci.com/'>FICCI</a> has Launched Campaign on Business to Pledge for Biodiversity. 21 companies have already join the Pledge and many more are expected to join. <a href='https://www.cbd.int/doc/champions/pledge-2012-10-22-ficci-en.pdf'>More</a>"
  }, {
    name: "Maldives",
    rank: 3,
    date: "2013-02-05",
    imgURL: "https://www.cbd.int/images/flags/64/flag-mv-64.png",
    link: "/actions/country/mv",
    aichiTargets: "4, 5, 6, 7, 11 and 15",
    pledge: " The whole country of Maldives will be a <a href='https://www.cbd.int/doc/world/mv/mv-biosphere-reserve-en.pdf'>UNESCO Biosphere Reserve by 2017</a>  – where public support for conservation of the country's remarkable environment secures a vibrant green economy and good quality of life for ail Maldivians. <a href='/doc/champions/pledge-2013-02-05-mv-en.pdf' class='atc-link'>More</a>"
  }, {
    name: "Friends of Target 12",
    rank: 4,
    date: "2013-03-04 ",
    imgURL: "https://www.cbd.int/images/aichi/48/abt-12-48.png",
    link: "https://www.cbd.int/sp/targets/rationale/target-12/",
    aichiTargets: "12",
    pledge: "19 partners, including Governments and International Organizations, launched the \"Friends of Target 12\" initiative to support CBD Parties and others to achieve Aichi Target 12 by providing practical guidance and raising awareness of initiatives and programmes that contribute to the implementation of the activities needed to stem the tide of species’ extinctions. "
  }, {
    name: "Caribbean Challenge Initiative (CCI)",
    rank: 5,
    date: "2013-05-18",
    imgURL: "https://www.cbd.int/cooperation/cci/images/cci-64.png",
    aichiTargets: "11 and 12 (also 5, 6, 7, and 10)",
    pledge: "Nine participating countries and territories to the <a href='https://www.cbd.int/cooperation/cci/'>Caribbean Challenge Initiative</a> have committed to conserving at least 20% of their nearshore marine and coastal environments in national marine protected areas systems by 2020; and creating National Conservation Trust Funds, endowed by new sustainable finance mechanisms (such as tourism fees), dedicated to solely to funding park management. A recent Summit of political and business leaders (<a href='https://www.cbd.int/cooperation/cci/doc/cover-note-submit-summary-2013-07-02-en.pdf'>Cover note</a> and  <a href='https://www.cbd.int/cooperation/cci/doc/cci-outcomes-summary-2013-06-27-en.pdf'>Summary of CCI Summit</a>) assisted in galvanizing US $75 million in funding commitments to safeguard the marine and coastal environment along with commitments to take new marine conservation actions and to put in place more sustainable business practices. The <a href='http://www.cbd.int/island/glispa.shtml '>Global Island Partnership</a> has been recognized to play a crucial role in supporting regional challenges. 7 full CBD Parties (Bahamas, Dominican Republic, Grenada, Jamaica, St. Kitts & Nevis, St. Lucia, and St. Vincent and the Grenadines) plus the British Virgin Islands (UK overseas territory) and Puerto Rico (US territory) are currently participating in the CCI. <br> <br> More:  Leaders declarations ( <a href='https://www.cbd.int/cooperation/cci/doc/leaders-declaration-en.pdf'>English</a> | <a href='https://www.cbd.int/cooperation/cci/doc/leaders-declaration-es.pdf'>Spanish</a>);  <a href='https://www.cbd.int/cooperation/cci/doc/corporate-compact-2013-05-17-en.pdf'>Corporate Compact</a>;  <a href='https://www.cbd.int/cooperation/cci/doc/letter-grenada-en.pdf'>Letter from Grenada Government</a> "
  }, {
    name: "Bridging Agriculture and Conservation Initiative",
    rank: 6,
    date: "2013-08-01",
    imgURL: "https://www.cbd.int/images/champions/bioversity-international-64.png",
    link: "http://www.bioversityinternational.org/",
    aichiTargets: "All",
    pledge: "<a href='http://www.bioversityinternational.org/'>Bioversity International</a> is leading this multi-institutional initiative to alleviate poverty, conserve biodiversity, and promote food security within global agricultural systems. (<a href='https://www.cbd.int/doc/champions/champions-2013-bioversity-baci.pdf'>Background to preparatory meeting</a> and <a href='http://www.bioversityinternational.org/fileadmin/bioversityDocs/Announcements/Agriculture_Conservation_Final_Declaration_03.pdf'>declaration of global leaders</a>).  It addresses needs for more sustainable, socially equitable, resilient, nutritious and adaptable, as well as productive, food and farming systems. The initiative pledges to build, and leverage existing, science and sound economics to underpin critical advances and raise awareness. Since agriculture is the dominant use of land and water, and has a prominent role in sustainable development, the initiative promotes important solutions to help achieve multiple Aichi Biodiversity Targets. <p><a href='https://www.cbd.int/doc/champions/champions-2013-bioversity-letter.pdf' class='atc-link'>2013 - Letter from Bioversity International Director General</a><br><a href='https://www.cbd.int/doc/champions/champions-2013-bioversity-baci.pdf' class='atc-link'>2013 - The Bridging Agriculture and Conservation Initiative (BACI)</a><br><a href='https://www.cbd.int/doc/champions/champions-2014-bioversity-letter.pdf' class='atc-link'>2014 - Letter from Bioversity International Director General</a><br><a href='https://www.cbd.int/doc/champions/champions-2014-bioversity-baci.pdf' class='atc-link'>2014 - Brief update on the status of Bioversity's BACI pledge</a> "
  }, {
    name: "Gaborone Declaration initiative",
    rank: 7,
    date: "2013-09-03",
    imgURL: "https://www.cbd.int/images/champions/bc-medal-64.png",
    link: "http://www.bioversityinternational.org/",
    aichiTargets: " 1, 2, 3, 4, 5, 7, 9, 12, 14, 15, 17 and 19 ",
    pledge: "The Gaborone Declaration on Sustainability in Africa, which has been signed by 10 African States and 19 non-state institutions, is an important vehicle for implementation of sustainability in Africa. Botswana pledges its implementation of its commitments under the Gaborone Declaration on Sustainability in Africa, towards meeting the Aichi Biodiversity Targets. <a href='https://www.cbd.int/doc/champions/gaborone-declaration-botswana-en.pdf'>The Gaborone Declaration</a> and <a href='https://www.cbd.int//doc/champions/letter-from-botswana-en.pdf'>Letter from the Botswana Government</a>. "
  }, {
    name: "Natural Capital Declaration (NCD)",
    rank: 8,
    date: "2013-10-10",
    imgURL: "https://www.cbd.int/images/champions/ncd-64.jpg",
    link: "http://www.naturalcapitaldeclaration.org",
    aichiTargets: "2",
    pledge: "The <a href='http://www.naturalcapitaldeclaration.org/'>Natural Capital Declaration (NCD)</a> is a finance-led and CEO-endorsed initiative to integrate natural capital considerations into financial products and services, and to work towards their inclusion in financial accounting, disclosure and reporting. <a href='http://www.naturalcapitaldeclaration.org/resources/' class='atc-link'>More</a>"
  }, {
    name: "World Public Health Nutrition Association (WPHNA)",
    rank: 9,
    date: "2013-11-14",
    imgURL: "https://www.cbd.int/images/champions/wphna-64.jpg",
    link: "http://wphna.org/",
    aichiTargets: "1, 4, 12, 13,14, 18, 19",
    pledge: "The <a href='http://wphna.org/'>WPHNA</a> will bring to the attention of its membership the relationship between nutrition and biodiversity, thereby advancing the CBD’s cross-cutting initiative on biodiversity for food and nutrition, the sustainable diets initiative, and contributing to the achievement of the Aichi Biodiversity Targets. <a href='https://www.cbd.int/doc/champions/pledge-form-2013-11-14-WPHNA-en.pdf' class='atc-link'>More</a>. "
  }, {
    name: "The India Business & Biodiversity Initiative (IBBI)",
    rank: 10,
    date: "2014-01-31",
    imgURL: "https://www.cbd.int/images/champions/cii-itc.jpg",
    link: "http://www.sustainabledevelopment.in/",
    aichiTargets: "1 to 16",
    pledge: "The <a href='http://www.cii.in'>Confederation of Indian Industry (CII)</a> is hosting the India Business & Biodiversity Initiative (IBBI) that is a national platform for business and its stakeholders for dialogue, sharing and learning on biodiversity management. Being a business-led multi-stakeholder initiative, the aim of IBBI is to mainstream sustainable management of biological diversity into business.  <a href='https://www.cbd.int/doc/champions/pledge-2014-01-31-cii-en.pdf' class='atc-link'>More</a>"
  }];
return champs;
});