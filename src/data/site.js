// Site-wide static data: members, campaigns, brand info

export const BRAND = {
    name: "Surat Kshtriya Yuvak Mandal",
    nameGujarati: "સુરત ક્ષત્રિય યુવક મંડળ",
    tagline: "Sahkar · Sangathan · Siddhi",
    taglineGujarati: "સહકાર · સંગઠન · સિદ્ધિ",
    mantra: "Tamaso Ma Jyotirgamay",
    mantraGujarati: "તમસો મા જ્યોતિર્ગમય",
    establishedSince: "Serving the Khatri community of Surat",
    instagram: "https://www.instagram.com/surat_kshtriya_yuvak_mandal/",
    email: "skymandal1961@gmail.com",
    location: "Surat, Gujarat, India",
    logoUrl: "/logo.png",
};

export const MEMBERS = [
    { role: "President", roleGu: "પ્રમુખ", name: "Shri Janak Kanaiyalal Kachiwala", core: true },
    { role: "Vice President", roleGu: "ઉપ-પ્રમુખ", name: "Shri Jatin Pravinchandra Fulwala", core: true },
    { role: "Secretary", roleGu: "મંત્રી", name: "Shri Arjun Bhupendra Galiawala", core: true },
    { role: "Joint Secretary", roleGu: "સહ-મંત્રી", name: "Shri Mehul Vijaykumar Chevli", core: true },
    { role: "Treasurer", roleGu: "ખજાનચી", name: "Shri Jenish Shailesh Jariwala", core: true },
    { role: "Immediate Past President", roleGu: "પૂર્વ પ્રમુખ", name: "Shri Dharmesh Kantilal Jariwala", core: true },
    { role: "Managing Committee", roleGu: "સંચાલન સમિતિ", name: "Shri Ashish Madanlal Rangunwala" },
    { role: "Managing Committee", roleGu: "સંચાલન સમિતિ", name: "Shri Vatsal Kalpeshkumar Chevli" },
    { role: "Managing Committee", roleGu: "સંચાલન સમિતિ", name: "Shri Nirav Vasantlal Doriwala" },
    { role: "Managing Committee", roleGu: "સંચાલન સમિતિ", name: "Shri Avinash Navneetlal Gonawala" },
    { role: "Managing Committee", roleGu: "સંચાલન સમિતિ", name: "Shri Ashish Rajendrakumar Kapadia" },
    { role: "Managing Committee", roleGu: "સંચાલન સમિતિ", name: "Shri Piyush Bipinchandra Lakdawala" },
    { role: "Managing Committee", roleGu: "સંચાલન સમિતિ", name: "Shri Jubin Pankaj Reshamwala" },
    { role: "Managing Committee", roleGu: "સંચાલન સમિતિ", name: "Shri Narayn Farashram Chevli" },
    { role: "Managing Committee", roleGu: "સંચાલન સમિતિ", name: "Shri Rishi Bipinchandra Jariwala" },
    { role: "Managing Committee", roleGu: "સંચાલન સમિતિ", name: "Shri Mayank Rajnikant Divetia" },
    { role: "Managing Committee", roleGu: "સંચાલન સમિતિ", name: "Shri Roshan Prashant Chimna" },
];

export const CAMPAIGNS = [
    {
        key: "blood",
        title: "Blood Donation Drives",
        titleGu: "રક્તદાન શિબિર",
        blurb:
            "Annual community blood donation camps in collaboration with leading Surat blood banks — every drop a tribute to life.",
        image:
            "https://images.unsplash.com/photo-1615461066159-fea0960485d5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwxfHxibG9vZCUyMGRvbmF0aW9ufGVufDB8fHx8MTc4MjgwNzM0NHww&ixlib=rb-4.1.0&q=85",
        span: "lg:col-span-8",
        height: "h-[28rem]",
    },
    {
        key: "education",
        title: "Education & Scholarships",
        titleGu: "શિક્ષણ સહાય",
        blurb:
            "Scholarships and academic recognition for deserving Khatri youth pursuing higher studies.",
        image:
            "https://images.unsplash.com/flagged/photo-1574097656146-0b43b7660cb6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBzdHVkZW50cyUyMGVkdWNhdGlvbnxlbnwwfHx8fDE3ODI4MDczNDR8MA&ixlib=rb-4.1.0&q=85",
        span: "lg:col-span-4",
        height: "h-[28rem]",
    },
    {
        key: "festivals",
        title: "Cultural & Religious Events",
        titleGu: "ઉત્સવ અને ધાર્મિક પ્રસંગો",
        blurb:
            "Janmashtami, Navratri, Holi and community satsangs — preserving traditions for the next generation.",
        image:
            "https://images.unsplash.com/photo-1774798909993-eecdf8de4472?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjb21tdW5pdHklMjBmZXN0aXZhbHxlbnwwfHx8fDE3ODI4MDczNDV8MA&ixlib=rb-4.1.0&q=85",
        span: "lg:col-span-5",
        height: "h-[24rem]",
    },
    {
        key: "medical",
        title: "Free Medical Camps",
        titleGu: "આરોગ્ય શિબિર",
        blurb:
            "General check-ups, eye care and diabetes screening camps for elders and underprivileged members.",
        image:
            "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80",
        span: "lg:col-span-4",
        height: "h-[24rem]",
    },
    {
        key: "marriage",
        title: "Samuh Lagna",
        titleGu: "સમૂહ લગ્ન",
        blurb:
            "Mass wedding ceremonies that ease the financial burden on families while celebrating community.",
        image:
            "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=1400&q=80",
        span: "lg:col-span-3",
        height: "h-[24rem]",
    },
    {
        key: "seniors",
        title: "Senior Citizen Seva",
        titleGu: "વડીલ સેવા",
        blurb:
            "Regular gatherings, health initiatives and recognition for our community elders.",
        image:
            "https://images.unsplash.com/photo-1559757175-08c5d6d4f5e8?auto=format&fit=crop&w=1400&q=80",
        span: "lg:col-span-6",
        height: "h-[22rem]",
    },
    {
        key: "community",
        title: "Community Outreach",
        titleGu: "સામાજિક સહાય",
        blurb:
            "Food drives, disaster relief contributions, and emergency aid for families in need.",
        image:
            "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1400&q=80",
        span: "lg:col-span-6",
        height: "h-[22rem]",
    },
];

export const VALUES = [
    {
        title: "Sahkar",
        titleGu: "સહકાર",
        blurb: "Cooperation — standing together as one extended family of the Khatri community.",
    },
    {
        title: "Sangathan",
        titleGu: "સંગઠન",
        blurb: "Unity — building a strong and unified organization to serve and uplift our samaj.",
    },
    {
        title: "Siddhi",
        titleGu: "સિદ્ધિ",
        blurb: "Achievement — every act of seva is a step toward collective progress.",
    },
];
