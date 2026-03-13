const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('C:/Users/Javier Soto/OneDrive/Escritorio/PMTBWB/src/pages/TotemSeriesDetail.jsx');

let content = fs.readFileSync(targetPath, 'utf8');

const newHeaderImages = `// Images for series headers
const seriesHeaderImages = {
    ravor: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F33%2F03%2F3d%2F1749728337%2FRavor_MainHeader.png&w=1080&q=75" },
    vantor: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F33%2F03%2F3d%2F1749728337%2FVantor_MainHeader.png&w=1080&q=75" },
    trailray: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F33%2F03%2F3d%2F1749728337%2FTrailray_MainHeader.png&w=1080&q=75" },
    airok: {
        image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fe8%2F63%2F20%2F1746520528%2Fairok_bg.png&w=1080&q=75",
        video: "https://player.vimeo.com/video/1172169652?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
    },
    arid: {
        image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F39%2F4f%2F3f%2F1747034794%2FArid_hero.png&w=1080&q=75",
        video: "https://player.vimeo.com/video/1172177666?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
    },
    arva: {
        image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F55%2F50%2Fd9%2F1750657745%2Fraymon-hero-02.png&w=1080&q=75",
        video: "https://player.vimeo.com/video/1172357308?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
    },
    airray: { image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1920&auto=format&fit=crop" },
    hardray: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Ff6%2F41%2F2b%2F1747034708%2FHardray_hero.png&w=1080&q=75" },
    kirana: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F22%2F6f%2F06%2F1747034579%2FKirana_hero.png&w=1080&q=75" },
    korak: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F16%2F5c%2F7b%2F1749728312%2FKorak_MainHeader.png&w=1080&q=75" },
    metmo: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F30%2Fc5%2F9f%2F1747034561%2FMetmo_hero.png&w=1080&q=75" },
    norza: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F03%2Fd0%2F6b%2F1749728258%2FNorza_MainHeader.png&w=1080&q=75" },
    rokua: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fd9%2Fb1%2Fb3%2F1747034724%2FRokua_hero.png&w=1080&q=75" },
    soreno: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fa2%2Fdd%2F6d%2F1747034598%2Fsoreno_hero.png&w=1080&q=75" },
    tahona: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Ff3%2F8c%2F60%2F1747034617%2FTahona_hero.png&w=1080&q=75" },
    tavano: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F8d%2F8a%2F60%2F1749728286%2FTavano_MainHeader.png&w=1080&q=75" },
    vamok: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fe8%2F63%2F20%2F1746520528%2Fairok_bg.png&w=1080&q=75" },
    yara: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fd4%2F0c%2Fc9%2F1747034740%2FYara_hero.png&w=1080&q=75" },
    zayn: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F66%2Fc1%2Fcb%2F1747034828%2FZayn_hero.png&w=1080&q=75" },
    default: { image: "https://www.raymon-bicycles.com/pim/media/592398/1000px/v2" }
};`;

const newMarketingData = `// Marketing Sections Data
const seriesMarketingData = {
    trailray: [
        {
            title: "Unleash your wild side \\non the trails.",
            text: [
                "Summit view, high above everyday life. The air is clear and you plunge into the descent with your ultra-sensitive suspension. The tires of your mullet wheels grip the ground as you swing through tight bends.",
                "Can you feel it? Every obstacle is an invitation and the end of the trail is just the beginning of your next adventure."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F11%2F46%2Ffc%2F1747376850%2FTrailray180_Ultra_Unleash-your-wild-Side_1920x1920%20(1).png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "Welcome to the \\nwildest Trailray Era.",
            text: [
                "Over the last 100 years, we have shaped many cycling moments - including the invention of the e-mountain bike. The latest addition to our Trailray series is now a tribute to the ultimate downhill fun.",
                "This bike is as aggressive as it looks and will defend you from anything that gets in your way."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F0d%2F78%2F8a%2F1747376861%2Fraymon-Trailray180_dmpfer_1920x1920%20(1).png&w=1080&q=75",
            imageRight: false
        }
    ],
    vantor: [
        {
            title: "Conquer the Terrain. \\nMaster the Journey.",
            text: [
                "The slope in front of you? Steep as your pulse. The ground? Loose gravel, jumping edge. Your fingers grip the grips tightly, you take a deep breath - and then you let it go.",
                "With 170 mm front and rear suspension travel, there's no more 'too steep'. Drops? You eat them. When others stop, you ride on because you know you can rely on your VANTOR without compromise."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F6d%2F29%2Fg0%2F1749728361%2FVantor_MainHeader.png&w=1080&q=75",
            imageRight: true
        }
    ],
    territ: [
        {
            title: "Dare to drive beyond \\nboundaries.",
            text: [
                "The Territ is your fast fun machine that loves both road and gravel. Fly through the city or conquer the dirt track. It not only gives you the flow, but also the freedom to change route at any time.",
                "For all those who want to push their limits on and off the road."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fa8%2F0b%2F45%2F1747139175%2FFrame%20867.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "High standards \\nfor mini riders.",
            text: [
                "Performance is not just for adults. The Territ is built with the same level of expertise and quality as our top-tier bikes. Light, durable, and ready for whatever the trail throws its way."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F85%2F25%2F8d%2F1747139187%2FFrame%20868.png&w=1080&q=75",
            imageRight: false
        }
    ],
    nayta: [
        {
            title: "Discover your \\nwilderness.",
            text: [
                "The scent of spruce and a mixture of stones - the forest path opens up in front of you. Your Nayta rolls easily over the gravel and your curiosity grows from bend to bend. With every pedal stroke, you glide deeper into the wilderness, exploring new paths and discovering what lies off the beaten track.",
                "Your Nayta is light, agile and just right for your first off-road experience."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fd0%2Fbd%2Fa7%2F1747290585%2FFrame%20861.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "From offroad oldies \\nfor newcomers.",
            text: [
                "For over 100 years, we have been developing bicycles that inspire generations. With the Nayta, we are passing on this experience directly to you. It is the perfect entry-level hardtail - for anyone who wants to embark on an off-road adventure without having to dig deep into their pockets.",
                "You can expect all the RAYMON factors such as the no-bullshit guarantee with high-quality components, the simple frame design with the lowered top tube and expandable equipment such as mudguards and lighting."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F96%2Fa8%2F13%2F1747290657%2FDetails_B230858.png&w=1080&q=75",
            imageRight: false
        }
    ],
    hardray: [
        {
            title: "Pure cross-country\\nvibes.",
            text: [
                "Mmm, it smells of fir. The path winds through the forest in front of you. You press the pedal and feel how the Hardray responds to you. It hums softly at your feet and the Yamaha power kicks in smoothly. You feel the ground beneath you and enjoy the honest ride.",
                "A climb appears in front of you. Easy - you shift down a gear and your Hardray pulls you up effortlessly. Whatever the terrain, you know you will conquer it."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F88%2F12%2F9a%2F1747204220%2FFrame%20843_(2).png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "Legacy in Every Ride.",
            text: [
                "Over the last 100 years of our family history, we have learned what really makes a good bike. Some call us the inventors of the e-mountain bike or the visionaries of the bicycle industry. With the Hardray, we are going back to the roots, combined with the comfortable technology of today.",
                "This makes the Hardray ideal for anyone who wants to discover new paths with an e-mountainbike. Without a lot of frills - a bike that is reduced to the essentials and still offers you everything you need for your next adventure."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Ff4%2F0b%2Fbc%2F1747204239%2FFrame%20844_(1).png&w=1080&q=75",
            imageRight: false
        }
    ],
    korak: [
        {
            title: "Your everyday adventures\\nbegins here.",
            text: [
                "You want to get out. Fresh air, the smell of the forest, gravel under your tires - feel real life. Not at some point. But now. Maybe after work. Maybe on a Saturday morning when everyone is still asleep. Maybe just because you want to get out for a moment. Get out of your head. Get on your bike.",
                "That's exactly what the KORAK is for. 140 mm front and rear suspension travel are perfect for your after-work ride, a weekend excursion or simply a ride along a country lane instead of through the city. The KORAK takes over what would otherwise slow you down and takes you exactly where you want to be: out into life."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F16%2F5c%2F7b%2F1749728312%2FKorak_MainHeader.png&w=1080&q=75",
            imageRight: true
        }
    ],
    arid: [
        {
            title: "Okay, let's push your \\nlimits.",
            text: [
                "The trail meets the horizon. Your muscle power is converted directly into propulsion by the stiff carbon frame. The wind whistles around your ears, the ground passes beneath you. No room for doubt, not a second for hesitation - just you and your Arid.",
                "Whether on long cross-country routes or fast off-road laps. The Arid is for everyone who loves the origin of biking and wants to test their limits."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F57%2F6b%2Ffa%2F1747138031%2FFrame%20863.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "Pure riding \\nexperience for the \\nhard core.",
            text: [
                "At RAYMON, we have been building bikes that inspire generations for over 100 years. We develop the right bike for every journey. The Arid is a race hardtail designed for passionate riding. It stands for pure riding pleasure.",
                "On the one hand, you are supported by high-end components that are designed for performance and weight. On the other hand, you can feel the ground, your thighs and your power. It is also designed for the extreme. For the hard core. For people who like to beat themselves."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fd9%2F80%2Fb3%2F1747138040%2FFrame%20864.png&w=1080&q=75",
            imageRight: false
        }
    ],
    kirana: [
        {
            title: "Find Harmony - \\non Wheels.",
            text: [
                "Helmet on, clicks on. Get on the Kirana and escape from reality. With the lightweight carbon frame and comfortable Continental 30 mm wide tires, you'll roll smoothly over the asphalt and cover the kilometers in record time.",
                "It's your moment of peace and concentration. A time when you are alone with the rhythm of your breathing and the hum of the wind."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F99%2F39%2F19%2F1747200177%2FRaymon_Kirana_Action_road_1920x1920_1920x1920.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "Raymon Design: Built \\nto Last.",
            text: [
                "The Kirana reflects a century of expertise in bicycle design. It combines robust and lightweight construction with timeless style, designed for durability and optimum performance. Trust in quality and precision craftsmanship and look forward to a bike that will accompany you for years to come.",
                "The Kirana is therefore the perfect choice for demanding cyclists who don't want to compromise on speed and comfort."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F2b%2F20%2Fa7%2F1747200193%2FRaymon_kirana_action_detail_rahmen_1920x1920.png&w=1080&q=75",
            imageRight: false
        }
    ],
    metmo: [
        {
            title: "Comfort and freedom\\non every kilometer.",
            text: [
                "The birds are chirping and you roll calmly and enjoyably to the market on your Metmo. The low frame allows you to get off easily and safely and push it through the stalls. Your basket is quickly filled with goodies and you look forward to the journey home because your Metmo makes the ride so easy.",
                "Whether for everyday use or on vacation: with the Metmo, every ride becomes a discovery tour that makes you smile."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fd9%2Ff6%2F0d%2F1719930712%2FRaymon_metmo_citybike_city_highlight.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "Designed for quality\\nof life.",
            text: [
                "With over 100 years of family history, we know that everyone has different needs. We have developed the Metmo for everyone who wants to cover distances that are too long on foot with comfort and ease.",
                "Metmo will be a faithful companion for years to come, allowing you to experience freedom in a whole new way."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F31%2F38%2F55%2F1724842838%2FMetmo_Rcklicht.png&w=1080&q=75",
            imageRight: false
        }
    ],
    norza: [
        {
            title: "From city lights to \\ngravel nights.",
            text: [
                "Dust dances in the air. The wind sings next to your ears. You started out on asphalt and now the gravel cracks beneath you. The plan starts without a plan. With the NORZA, you have everything that drives you: Lightness, speed and freedom.",
                "Thanks to the carbon frame and Bosch SX drive, you can feel how much you're capable of with every pedal stroke. You step on the gas, your NORZA responds."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F03%2Fd0%2F6b%2F1749728258%2FNorza_MainHeader.png&w=1080&q=75",
            imageRight: true
        }
    ],
    rokua: [
        {
            title: "The ultimate Thrill-\\nMachine.",
            text: [
                "A look down: Dirt road, tight bends - exactly your territory. You release the brakes and shoot off into the trails on your Rokua. The ultra-light 14.7 kg lets you feel that every gram counts. No ballast, pure performance. Your 29\\" tires roll over everything, your high-end suspension swallows the fattest obstacles.",
                "The descent becomes a rush. Your heart is pounding, everything is tingling. Warning: the Rokua is addictive!"
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F7e%2F74%2F2d%2F1747136754%2FRokua_Thrill.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "No-bullshit \\nguarantee",
            text: [
                "At RAYMON we follow a clear philosophy: No-bullshit bikes! That's why the Rokua is uncompromisingly honestly equipped and a real insider tip if you're looking for high-end performance at an unbeatable price. With the Rokua, you can fly over the trail with a carbon frame, premium suspension, full 29er and perfectly tuned geo. And all this with a total weight of just 14.7 kg.",
                "After 100 years of bike family history, this means that the Rokua has become a damn good bike!"
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F7b%2Fb2%2Fa8%2F1747136765%2FFrame%20851.png&w=1080&q=75",
            imageRight: false
        }
    ],
    soreno: [
        {
            title: "Every road, your \\nadventure.",
            text: [
                "The morning breeze blows through your face and you ride past everyone in the traffic jam. Even when the asphalt gives way to gravel, you can master the shortcut with ease and style thanks to the lightweight carbon frame and 45 mm wide tires - perfect for your daily dose of freedom on the way to the office.",
                "These daily moments on your Soreno remind you to see the day differently. As a chance to make the ordinary extraordinary."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F2e%2F52%2F07%2F1747145028%2FRaymon_sorena_gravel_action_highlight_1920x1920.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "Raymon quality that \\nmoves you.",
            text: [
                "Raymon stands for over 100 years of experience in bicycle craftsmanship and this experience lives on in the Soreno. It is specially adapted to the needs of gravel bike enthusiasts to overcome the city limits and explore nature.",
                "This means that we have packed our claim to first-class components with a focus on design and performance into a gravel bike for you. This makes the Soreno perfect for anyone who knows no limits and is looking for adventure."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F1f%2F5c%2F0d%2F1747145040%2FRaymon_sorena_gravel_detail_rahmen_1920x1920.png&w=1080&q=75",
            imageRight: false
        }
    ],
    tahona: [
        {
            title: "Through town and\\ncountry in style.",
            text: [
                "You glide gently through the morning breeze as the city comes to life. With every pedal stroke, you can feel how your Tahona effortlessly takes you to your destination - ideal for a quick hop to the bakery or on the way to the gym.",
                "At the weekend, your Tahona will also accompany you on long tours: strap the picnic blanket or child seat onto your multifunctional luggage carrier and discover the world together with your loved ones."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F72%2Fb3%2F43%2F1747202163%2FTahona_Group%2034175_1920x1920.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "+100 years of\\nexperience for your\\neveryday life.",
            text: [
                "Raymon is a family business with over 100 years of history. We understand how dynamic everyday family life can be. That's why the Tahona was specially developed to support you in your daily adventures and make every day a little easier. You can rely on your Tahona wherever you go - with over a century of experience behind it."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Ffa%2Fbb%2Ffa%2F1747202202%2FRAY_Tahona_Pro_black_stealth_Diamant_back%201%20(1)_1920x1920.png&w=1080&q=75",
            imageRight: false
        }
    ],
    tavano: [
        {
            title: "The SUV feeling on\\ntwo wheels.",
            text: [
                "You glide smoothly over cobblestones while others bump. You roll easily over kerbs while others have to dismount. The TAVANO transforms any surface into your personal red carpet. With its 120 mm rear suspension, it absorbs any unevenness and lets you ride relaxed through town and gravel - as if you were gliding on clouds.",
                "With the TAVANO, you will discover a new way of riding a bike."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F8d%2F8a%2F60%2F1749728286%2FTavano_MainHeader.png&w=1080&q=75",
            imageRight: true
        }
    ],
    vamok: [
        {
            title: "Discover the Vamok.\\nAgility redefined.",
            text: [
                "The Vamok is built for the playful rider. With its agile geometry and poppy suspension, it turns every trail into a playground. Expect quick cornering and massive airtime."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fe8%2F63%2F20%2F1746520528%2Fairok_bg.png&w=1080&q=75",
            imageRight: true
        }
    ],
    yara: [
        {
            title: "Get ready for big \\nadventures.",
            text: [
                "Saturday morning. The sun is shining and you can hardly wait to get going. Whether you're exploring the trails with friends, finding new lines or simply cruising through the forest - no matter what - you're in the mood for biking today!",
                "You get on your Yara and start off with a nice bounce. Oh yes, it's just different with full suspension. And then it's there: the perfect trail. Together with the 4-bar kinematics and the air suspension, you rock the descent. Woah, do it again!"
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fcb%2Fe7%2F37%2F1747137423%2FYara_detail.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "Your ticket to the \\nworld of full \\nsuspension.",
            text: [
                "We are also known as the inventors of the electric mountain bike. That's why we know how important the first step into the mountain bike world is. The Yara is our promise to all young riders who want more - more control, more comfort, more fun.",
                "No matter whether you are just starting out or have already gained some experience: With the Yara, you're equipped with the same technology that the big boys ride."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F99%2F33%2Fc3%2F1747137444%2FYara_Frame%20857.png&w=1080&q=75",
            imageRight: false
        }
    ],
    zayn: [
        {
            title: "Join the urban flow.",
            text: [
                "The morning is raging, the city is buzzing and you glide through the streets as if dancing with your Zayn. You ride relaxed with wide tires over rails and cobblestones. Past honking cars while the LED lighting shows you the way. The lightweight, almost seamless frame is the perfect match for your urban lifestyle.",
                "Whether it's to the office, the shops or the café - with Zayn, you live your everyday life, only faster and much more relaxed."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F21%2F45%2F9f%2F1747288829%2FFrame%20872.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "Your everyday life \\nwill love it.",
            text: [
                "We have been developing bikes for over 100 years and the Zayn really is our everyday bike favorite. Because the Zayn goes back to its origins. It has been specially developed for everyday journeys. For people who want to live their everyday lives with ease.",
                "If you were to ask us how it rides, we would lovingly say: It rides like a normal bike that you can simply rely on. Back to the roots, no frills, nice and light and with everything you need for everyday life."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F09%2F0d%2Fae%2F1747288841%2FRaymon_Zayn_Detail_B232287.png&w=1080&q=75",
            imageRight: false
        }
    ]
};`;

const regexHeader = /\\/\\/ Images for series headers\\s+const seriesHeaderImages = \\{[\\s\\S]*?\\n\\};/;
const regexMarketing = /\\/\\/ Marketing Sections Data\\s+const seriesMarketingData = \\{[\\s\\S]*?\\n\\};/;

if (regexHeader.test(content) && regexMarketing.test(content)) {
    content = content.replace(regexHeader, newHeaderImages);
    content = content.replace(regexMarketing, newMarketingData);
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log("Successfully replaced both data structures.");
} else {
    console.log("Could not find the target regexes in the file");
}
