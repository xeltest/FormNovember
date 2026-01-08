// Territory constants and utility functions for release distribution configuration

export const CONTINENTS = {
  'North America': ['United States', 'Canada', 'Mexico', 'Anguilla', 'Antigua And Barbuda', 'Aruba', 'Bahamas', 'Barbados', 'Belize', 'Bermuda', 'British Virgin Islands', 'Cayman Islands', 'Costa Rica', 'Cuba', 'Dominica', 'Dominican Republic', 'El Salvador', 'Greenland', 'Grenada', 'Guadeloupe', 'Guatemala', 'Haiti', 'Honduras', 'Jamaica', 'Martinique', 'Montserrat', 'Nicaragua', 'Panama', 'Puerto Rico', 'Saint Kitts And Nevis', 'Saint Lucia', 'Saint Vincent And The Grenadines', 'St. Pierre And Miquelon', 'Trinidad And Tobago', 'Turks And Caicos Islands', 'United States Virgin Islands', 'Netherlands Antilles', 'Saint-Barthélemy', 'Saint-Martin (French part)'],
  'Europe': ['Aland Islands', 'Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia And Herzegowina', 'Bulgaria', 'Croatia (local Name: Hrvatska)', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Faroe Islands', 'Finland', 'France', 'Germany', 'Gibraltar', 'Greece', 'Guernsey', 'Holy See (vatican City State)', 'Hungary', 'Iceland', 'Ireland', 'Isle of Man', 'Italy', 'Jersey', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova, Republic Of', 'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania', 'San Marino', 'Serbia', 'Slovakia (slovak Republic)', 'Slovenia', 'Spain', 'Svalbard And Jan Mayen Islands', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom'],
  'Asia': ['Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei Darussalam', 'Cambodia', 'China', 'Georgia', 'Hong Kong', 'India', 'Indonesia', 'Iran (islamic Republic Of)', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Korea, Republic Of', 'Korea, D.p.r.o.', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Lebanon', 'Macau', 'Malaysia', 'Maldives', 'Mongolia', 'Myanmar (burma)', 'Nepal', 'Oman', 'Pakistan', 'Palestinian Territory, Occupied', 'Philippines', 'Qatar', 'Saudi Arabia','Singapore', 'Sri Lanka', 'Syrian Arab Republic', 'Taiwan, Province Of China', 'Tajikistan', 'Thailand', 'Timor-Leste', 'Turkey', 'Turkmenistan', 'United Arab Emirates', 'Uzbekistan', 'Viet Nam', 'Yemen'],
  'South America': ['Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'French Guiana', 'Guyana', 'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela', 'Falkland Islands (malvinas)'],
  'Africa': ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Comoros', 'Cote D\'ivoire', 'Congo', 'Congo, The Drc', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libyan Arab Jamahiriya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Mayotte', 'Morocco', 'Mozambique', 'Namibia','Niger', 'Nigeria', 'Reunion', 'Rwanda', 'Sao Tome And Principe', 'Senegal', 'Seychelles','Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'St. Helena', 'Sudan', 'Swaziland', 'Tanzania, United Republic Of', 'Togo', 'Tunisia', 'Uganda', 'Western Sahara', 'Zambia', 'Zimbabwe'],
  'Oceania': ['American Samoa', 'Australia', 'Cocos (keeling) Islands', 'Cook Islands', 'Fiji', 'French Polynesia', 'Guam', 'Heard And Mc Donald Islands', 'Kiribati', 'Marshall Islands', 'Micronesia, Federated States Of', 'Nauru', 'New Caledonia', 'New Zealand', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Palau', 'Papua New Guinea', 'Pitcairn', 'Samoa', 'Solomon Islands', 'Tokelau', 'Tonga', 'Tuvalu', 'Vanuatu', 'Wallis And Futuna Islands', 'U.s. Minor Islands', 'South Georgia And South S.s.']
};

// ISO 2-letter country codes mapping
export const COUNTRY_CODES: { [key: string]: string } = {
  'United States': 'US',
  'Canada': 'CA',
  'Mexico': 'MX',
  'Anguilla': 'AI',
  'Antigua And Barbuda': 'AG',
  'Aruba': 'AW',
  'Bahamas': 'BS',
  'Barbados': 'BB',
  'Belize': 'BZ',
  'Bermuda': 'BM',
  'British Virgin Islands': 'VG',
  'Cayman Islands': 'KY',
  'Costa Rica': 'CR',
  'Cuba': 'CU',
  'Dominica': 'DM',
  'Dominican Republic': 'DO',
  'El Salvador': 'SV',
  'Greenland': 'GL',
  'Grenada': 'GD',
  'Guadeloupe': 'GP',
  'Guam': 'GU',
  'Guatemala': 'GT',
  'Haiti': 'HT',
  'Honduras': 'HN',
  'Jamaica': 'JM',
  'Martinique': 'MQ',
  'Montserrat': 'MS',
  'Nicaragua': 'NI',
  'Panama': 'PA',
  'Puerto Rico': 'PR',
  'Saint Kitts And Nevis': 'KN',
  'Saint Lucia': 'LC',
  'Saint Vincent And The Grenadines': 'VC',
  'St. Pierre And Miquelon': 'PM',
  'Trinidad And Tobago': 'TT',
  'Turks And Caicos Islands': 'TC',
  'United States Virgin Islands': 'VI',
  'Netherlands Antilles': 'AN',
  'Saint-Barthélemy': 'BL',
  'Saint-Martin (French part)': 'MF',
  'Aland Islands': 'AX',
  'Albania': 'AL',
  'Andorra': 'AD',
  'Austria': 'AT',
  'Belarus': 'BY',
  'Belgium': 'BE',
  'Bosnia And Herzegowina': 'BA',
  'Bulgaria': 'BG',
  'Croatia (local Name: Hrvatska)': 'HR',
  'Cyprus': 'CY',
  'Czech Republic': 'CZ',
  'Denmark': 'DK',
  'Estonia': 'EE',
  'Faroe Islands': 'FO',
  'Finland': 'FI',
  'France': 'FR',
  'Germany': 'DE',
  'Gibraltar': 'GI',
  'Greece': 'GR',
  'Guernsey': 'GG',
  'Holy See (vatican City State)': 'VA',
  'Hungary': 'HU',
  'Iceland': 'IS',
  'Ireland': 'IE',
  'Isle of Man': 'IM',
  'Italy': 'IT',
  'Jersey': 'JE',
  'Latvia': 'LV',
  'Liechtenstein': 'LI',
  'Lithuania': 'LT',
  'Luxembourg': 'LU',
  'Malta': 'MT',
  'Moldova, Republic Of': 'MD',
  'Monaco': 'MC',
  'Montenegro': 'ME',
  'Netherlands': 'NL',
  'North Macedonia': 'MK',
  'Norway': 'NO',
  'Poland': 'PL',
  'Portugal': 'PT',
  'Romania': 'RO',
  'San Marino': 'SM',
  'Serbia': 'RS',
  'Slovakia (slovak Republic)': 'SK',
  'Slovenia': 'SI',
  'Spain': 'ES',
  'Svalbard And Jan Mayen Islands': 'SJ',
  'Sweden': 'SE',
  'Switzerland': 'CH',
  'Ukraine': 'UA',
  'United Kingdom': 'GB',
  'Afghanistan': 'AF',
  'Armenia': 'AM',
  'Azerbaijan': 'AZ',
  'Bahrain': 'BH',
  'Bangladesh': 'BD',
  'Bhutan': 'BT',
  'Brunei Darussalam': 'BN',
  'Cambodia': 'KH',
  'China': 'CN',
  'Georgia': 'GE',
  'Hong Kong': 'HK',
  'India': 'IN',
  'Indonesia': 'ID',
  'Iran (islamic Republic Of)': 'IR',
  'Iraq': 'IQ',
  'Israel': 'IL',
  'Japan': 'JP',
  'Jordan': 'JO',
  'Kazakhstan': 'KZ',
  'Korea, Republic Of': 'KR',
  'Korea, D.p.r.o.': 'KP',
  'Kuwait': 'KW',
  'Kyrgyzstan': 'KG',
  'Laos': 'LA',
  'Lebanon': 'LB',
  'Macau': 'MO',
  'Malaysia': 'MY',
  'Maldives': 'MV',
  'Mongolia': 'MN',
  'Myanmar (burma)': 'MM',
  'Nepal': 'NP',
  'Oman': 'OM',
  'Pakistan': 'PK',
  'Palestinian Territory, Occupied': 'PS',
  'Philippines': 'PH',
  'Qatar': 'QA',
  'Saudi Arabia': 'SA',
  'Singapore': 'SG',
  'Sri Lanka': 'LK',
  'Syrian Arab Republic': 'SY',
  'Taiwan, Province Of China': 'TW',
  'Tajikistan': 'TJ',
  'Thailand': 'TH',
  'Timor-Leste': 'TL',
  'Turkey': 'TR',
  'Turkmenistan': 'TM',
  'United Arab Emirates': 'AE',
  'Uzbekistan': 'UZ',
  'Viet Nam': 'VN',
  'Yemen': 'YE',
  'Argentina': 'AR',
  'Bolivia': 'BO',
  'Brazil': 'BR',
  'Chile': 'CL',
  'Colombia': 'CO',
  'Ecuador': 'EC',
  'French Guiana': 'GF',
  'Guyana': 'GY',
  'Paraguay': 'PY',
  'Peru': 'PE',
  'Suriname': 'SR',
  'Uruguay': 'UY',
  'Venezuela': 'VE',
  'Falkland Islands (malvinas)': 'FK',
  'Algeria': 'DZ',
  'Angola': 'AO',
  'Benin': 'BJ',
  'Botswana': 'BW',
  'Burkina Faso': 'BF',
  'Burundi': 'BI',
  'Cameroon': 'CM',
  'Cape Verde': 'CV',
  'Central African Republic': 'CF',
  'Chad': 'TD',
  'Comoros': 'KM',
  'Cote D\'ivoire': 'CI',
  'Congo': 'CG',
  'Congo, The Drc': 'CD',
  'Djibouti': 'DJ',
  'Egypt': 'EG',
  'Equatorial Guinea': 'GQ',
  'Eritrea': 'ER',
  'Ethiopia': 'ET',
  'Gabon': 'GA',
  'Gambia': 'GM',
  'Ghana': 'GH',
  'Guinea': 'GN',
  'Guinea-bissau': 'GW',
  'Kenya': 'KE',
  'Lesotho': 'LS',
  'Liberia': 'LR',
  'Libyan Arab Jamahiriya': 'LY',
  'Madagascar': 'MG',
  'Malawi': 'MW',
  'Mali': 'ML',
  'Mauritania': 'MR',
  'Mauritius': 'MU',
  'Mayotte': 'YT',
  'Morocco': 'MA',
  'Mozambique': 'MZ',
  'Namibia': 'NA',
  'Niger': 'NE',
  'Nigeria': 'NG',
  'Reunion': 'RE',
  'Rwanda': 'RW',
  'Sao Tome And Principe': 'ST',
  'Senegal': 'SN',
  'Seychelles': 'SC',
  'Sierra Leone': 'SL',
  'Somalia': 'SO',
  'South Africa': 'ZA',
  'South Sudan': 'SS',
  'St. Helena': 'SH',
  'Sudan': 'SD',
  'Swaziland': 'SZ',
  'Tanzania, United Republic Of': 'TZ',
  'Togo': 'TG',
  'Tunisia': 'TN',
  'Uganda': 'UG',
  'Western Sahara': 'EH',
  'Zambia': 'ZM',
  'Zimbabwe': 'ZW',
  'American Samoa': 'AS',
  'Australia': 'AU',
  'Cocos (keeling) Islands': 'CC',
  'Cook Islands': 'CK',
  'Fiji': 'FJ',
  'French Polynesia': 'PF',
  'Heard And Mc Donald Islands': 'HM',
  'Kiribati': 'KI',
  'Marshall Islands': 'MH',
  'Micronesia, Federated States Of': 'FM',
  'Nauru': 'NR',
  'New Caledonia': 'NC',
  'New Zealand': 'NZ',
  'Niue': 'NU',
  'Norfolk Island': 'NF',
  'Northern Mariana Islands': 'MP',
  'Palau': 'PW',
  'Papua New Guinea': 'PG',
  'Pitcairn': 'PN',
  'Samoa': 'WS',
  'Solomon Islands': 'SB',
  'Tokelau': 'TK',
  'Tonga': 'TO',
  'Tuvalu': 'TV',
  'Vanuatu': 'VU',
  'Wallis And Futuna Islands': 'WF',
  'U.s. Minor Islands': 'UM',
  'South Georgia And South S.s.': 'GS'
};

/**
 * Get ISO 2-letter code for a country name
 */
export const getCountryCode = (countryName: string): string => {
  return COUNTRY_CODES[countryName] || '';
};

/**
 * Get all countries for a specific continent
 */
export const getContinentCountries = (continent: string): string[] => {
  return CONTINENTS[continent as keyof typeof CONTINENTS] || [];
};

/**
 * Get all countries sorted alphabetically
 */
export const getAllCountries = (): string[] => {
  return Object.values(CONTINENTS).flat().sort();
};

/**
 * Count total territories (continents + individual countries)
 */
export const countTerritories = (territories: string[]): number => {
  return territories.length;
};

/**
 * Get total number of all available countries
 */
export const getTotalCountries = (): number => {
  return getAllCountries().length;
};

/**
 * Check if a territory is a continent name
 */
export const isContinent = (name: string): boolean => {
  return name in CONTINENTS;
};

/**
 * Get the continent name for a country
 */
export const getContinentForCountry = (country: string): string | null => {
  for (const [continent, countries] of Object.entries(CONTINENTS)) {
    if (countries.includes(country)) {
      return continent;
    }
  }
  return null;
};
