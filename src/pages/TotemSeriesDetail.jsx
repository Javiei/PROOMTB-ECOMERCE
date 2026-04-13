import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useParams, useNavigate } from 'react-router-dom';
import { slugify, formatPrice } from '../utils';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Zap, Battery, Activity, ArrowUpCircle } from 'lucide-react';
import raymonLogo from '../assets/Raymon_logo_black schriftzug.png';
import proomtbLogo from '../assets/proomtb_logo_white.png';
// Images for series headers
const seriesHeaderImages = {
    ravor: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F33%2F03%2F3d%2F1749728337%2FRavor_MainHeader.png&w=1080&q=75" },
    vantor: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F33%2F03%2F3d%2F1749728337%2FVantor_MainHeader.png&w=1080&q=75" },
    trailray: { image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F33%2F03%2F3d%2F1749728337%2FTrailray_MainHeader.png&w=1080&q=75" },
    airok: {
        image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fe8%2F63%2F20%2F1746520528%2Fairok_bg.png&w=1080&q=75"
    },
    arid: {
        image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F39%2F4f%2F3f%2F1747034794%2FArid_hero.png&w=1080&q=75"
    },
    arva: {
        image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F55%2F50%2Fd9%2F1750657745%2Fraymon-hero-02.png&w=1080&q=75"
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
    tarok: { image: "https://rwbxersfwgmkixulhnxp.supabase.co/storage/v1/object/sign/bicicletas/Tarok/Ultra/Raymon_Tarok_Ultra_front.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjU5MzQwZS1mMGM0LTRkM2QtYmNiZi1kZjRlY2MyMWNkNTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaWNpY2xldGFzL1Rhcm9rL1VsdHJhL1JheW1vbl9UYXJva19VbHRyYV9mcm9udC5wbmciLCJpYXQiOjE3NzYwMjUxMzQsImV4cCI6ODgxNzU5Mzg3MzR9.xXvnDG3FUyXMxuKLXBS4MHtMswWVIA7Yl6Qt__Mvjm4" },
    default: { image: "https://www.raymon-bicycles.com/pim/media/592398/1000px/v2" }
};

// Marketing Sections Data
const seriesMarketingData = {
    trailray: [
        {
            title: "Unleash your wild side \non the trails.",
            text: [
                "Summit view, high above everyday life. The air is clear and you plunge into the descent with your ultra-sensitive suspension. The tires of your mullet wheels grip the ground as you swing through tight bends.",
                "Can you feel it? Every obstacle is an invitation and the end of the trail is just the beginning of your next adventure."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F11%2F46%2Ffc%2F1747376850%2FTrailray180_Ultra_Unleash-your-wild-Side_1920x1920%20(1).png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "Welcome to the \nwildest Trailray Era.",
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
            title: "Conquer the Terrain. \nMaster the Journey.",
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
            title: "Dare to drive beyond \nboundaries.",
            text: [
                "The Territ is your fast fun machine that loves both road and gravel. Fly through the city or conquer the dirt track. It not only gives you the flow, but also the freedom to change route at any time.",
                "For all those who want to push their limits on and off the road."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fa8%2F0b%2F45%2F1747139175%2FFrame%20867.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "High standards \nfor mini riders.",
            text: [
                "Performance is not just for adults. The Territ is built with the same level of expertise and quality as our top-tier bikes. Light, durable, and ready for whatever the trail throws its way."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F85%2F25%2F8d%2F1747139187%2FFrame%20868.png&w=1080&q=75",
            imageRight: false
        }
    ],
    nayta: [
        {
            title: "Discover your \nwilderness.",
            text: [
                "The scent of spruce and a mixture of stones - the forest path opens up in front of you. Your Nayta rolls easily over the gravel and your curiosity grows from bend to bend. With every pedal stroke, you glide deeper into the wilderness, exploring new paths and discovering what lies off the beaten track.",
                "Your Nayta is light, agile and just right for your first off-road experience."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fd0%2Fbd%2Fa7%2F1747290585%2FFrame%20861.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "From offroad oldies \nfor newcomers.",
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
            title: "Pure cross-country\nvibes.",
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
            title: "Your everyday adventures\nbegins here.",
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
            title: "Okay, let's push your \nlimits.",
            text: [
                "The trail meets the horizon. Your muscle power is converted directly into propulsion by the stiff carbon frame. The wind whistles around your ears, the ground passes beneath you. No room for doubt, not a second for hesitation - just you and your Arid.",
                "Whether on long cross-country routes or fast off-road laps. The Arid is for everyone who loves the origin of biking and wants to test their limits."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F57%2F6b%2Ffa%2F1747138031%2FFrame%20863.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "Pure riding \nexperience for the \nhard core.",
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
            title: "Find Harmony - \non Wheels.",
            text: [
                "Helmet on, clicks on. Get on the Kirana and escape from reality. With the lightweight carbon frame and comfortable Continental 30 mm wide tires, you'll roll smoothly over the asphalt and cover the kilometers in record time.",
                "It's your moment of peace and concentration. A time when you are alone with the rhythm of your breathing and the hum of the wind."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F99%2F39%2F19%2F1747200177%2FRaymon_Kirana_Action_road_1920x1920_1920x1920.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "Raymon Design: Built \nto Last.",
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
            title: "Comfort and freedom\non every kilometer.",
            text: [
                "The birds are chirping and you roll calmly and enjoyably to the market on your Metmo. The low frame allows you to get off easily and safely and push it through the stalls. Your basket is quickly filled with goodies and you look forward to the journey home because your Metmo makes the ride so easy.",
                "Whether for everyday use or on vacation: with the Metmo, every ride becomes a discovery tour that makes you smile."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fd9%2Ff6%2F0d%2F1719930712%2FRaymon_metmo_citybike_city_highlight.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "Designed for quality\nof life.",
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
            title: "From city lights to \ngravel nights.",
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
            title: "The ultimate Thrill-\nMachine.",
            text: [
                "A look down: Dirt road, tight bends - exactly your territory. You release the brakes and shoot off into the trails on your Rokua. The ultra-light 14.7 kg lets you feel that every gram counts. No ballast, pure performance. Your 29\" tires roll over everything, your high-end suspension swallows the fattest obstacles.",
                "The descent becomes a rush. Your heart is pounding, everything is tingling. Warning: the Rokua is addictive!"
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F7e%2F74%2F2d%2F1747136754%2FRokua_Thrill.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "No-bullshit \nguarantee",
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
            title: "Every road, your \nadventure.",
            text: [
                "The morning breeze blows through your face and you ride past everyone in the traffic jam. Even when the asphalt gives way to gravel, you can master the shortcut with ease and style thanks to the lightweight carbon frame and 45 mm wide tires - perfect for your daily dose of freedom on the way to the office.",
                "These daily moments on your Soreno remind you to see the day differently. As a chance to make the ordinary extraordinary."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F2e%2F52%2F07%2F1747145028%2FRaymon_sorena_gravel_action_highlight_1920x1920.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "Raymon quality that \nmoves you.",
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
            title: "Through town and\ncountry in style.",
            text: [
                "You glide gently through the morning breeze as the city comes to life. With every pedal stroke, you can feel how your Tahona effortlessly takes you to your destination - ideal for a quick hop to the bakery or on the way to the gym.",
                "At the weekend, your Tahona will also accompany you on long tours: strap the picnic blanket or child seat onto your multifunctional luggage carrier and discover the world together with your loved ones."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F72%2Fb3%2F43%2F1747202163%2FTahona_Group%2034175_1920x1920.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "+100 years of\nexperience for your\neveryday life.",
            text: [
                "Raymon is a family business with over 100 years of history. We understand how dynamic everyday family life can be. That's why the Tahona was specially developed to support you in your daily adventures and make every day a little easier. You can rely on your Tahona wherever you go - with over a century of experience behind it."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Ffa%2Fbb%2Ffa%2F1747202202%2FRAY_Tahona_Pro_black_stealth_Diamant_back%201%20(1)_1920x1920.png&w=1080&q=75",
            imageRight: false
        }
    ],
    tavano: [
        {
            title: "The SUV feeling on\ntwo wheels.",
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
            title: "Discover the Vamok.\nAgility redefined.",
            text: [
                "The Vamok is built for the playful rider. With its agile geometry and poppy suspension, it turns every trail into a playground. Expect quick cornering and massive airtime."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fe8%2F63%2F20%2F1746520528%2Fairok_bg.png&w=1080&q=75",
            imageRight: true
        }
    ],
    yara: [
        {
            title: "Get ready for big \nadventures.",
            text: [
                "Saturday morning. The sun is shining and you can hardly wait to get going. Whether you're exploring the trails with friends, finding new lines or simply cruising through the forest - no matter what - you're in the mood for biking today!",
                "You get on your Yara and start off with a nice bounce. Oh yes, it's just different with full suspension. And then it's there: the perfect trail. Together with the 4-bar kinematics and the air suspension, you rock the descent. Woah, do it again!"
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2Fcb%2Fe7%2F37%2F1747137423%2FYara_detail.png&w=1080&q=75",
            imageRight: true
        },
        {
            title: "Your ticket to the \nworld of full \nsuspension.",
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
            title: "Your everyday life \nwill love it.",
            text: [
                "We have been developing bikes for over 100 years and the Zayn really is our everyday bike favorite. Because the Zayn goes back to its origins. It has been specially developed for everyday journeys. For people who want to live their everyday lives with ease.",
                "If you were to ask us how it rides, we would lovingly say: It rides like a normal bike that you can simply rely on. Back to the roots, no frills, nice and light and with everything you need for everyday life."
            ],
            image: "https://www.raymon-bicycles.com/_next/image?url=https%3A%2F%2Fb2b.raymon-bicycles.com%2Fmedia%2F09%2F0d%2Fae%2F1747288841%2FRaymon_Zayn_Detail_B232287.png&w=1080&q=75",
            imageRight: false
        }
    ],
    tarok: [
        {
            title: "THE NEW TAROK: \nUNLEASH THE POWER.",
            text: [
                "150 Nm of pure adrenaline. The new Tarok isn't just an e-bike; it's a technological marvel. Featuring the revolutionary DJI Avinox system, it delivers performance that was previously unthinkable.",
                "Whether you're climbing the steepest peaks or flying through technical descents, the Tarok gives you the control and torque to dominate any terrain."
            ],
            image: "https://rwbxersfwgmkixulhnxp.supabase.co/storage/v1/object/sign/bicicletas/Tarok/Ultra/Raymon_Tarok_Ultra_front.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjU5MzQwZS1mMGM0LTRkM2QtYmNiZi1kZjRlY2MyMWNkNTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaWNpY2xldGFzL1Rhcm9rL1VsdHJhL1JheW1vbl9UYXJva19VbHRyYV9mcm9udC5wbmciLCJpYXQiOjE3NzYwMjUxMzQsImV4cCI6ODgxNzU5Mzg3MzR9.xXvnDG3FUyXMxuKLXBS4MHtMswWVIA7Yl6Qt__Mvjm4",
            imageRight: true
        },
        {
            title: "POWERED BY \nDJI AVINOX.",
            text: [
                "Innovation in every detail. The DJI Avinox drive system is a game-changer. Lightweight, powerful, and incredibly smart. With multiple riding modes and seamless integration, it adapts to your style in real-time.",
                "20.4 KG of pure carbon and aluminum engineering, balanced to perfection for the ultimate trail experience."
            ],
            image: "https://rwbxersfwgmkixulhnxp.supabase.co/storage/v1/object/sign/bicicletas/Tarok/Ultra/Raymon_Tarok_Ultra_front.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjU5MzQwZS1mMGM0LTRkM2QtYmNiZi1kZjRlY2MyMWNkNTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaWNpY2xldGFzL1Rhcm9rL1VsdHJhL1JheW1vbl9UYXJva19VbHRyYV9mcm9udC5wbmciLCJpYXQiOjE3NzYwMjUxMzQsImV4cCI6ODgxNzU5Mzg3MzR9.xXvnDG3FUyXMxuKLXBS4MHtMswWVIA7Yl6Qt__Mvjm4",
            imageRight: false
        }
    ]
};

const specsMapping = [
    { label: 'Cuadro', key: 'cuadro_material' },
    { label: 'Horquilla', key: 'horquilla' },
    { label: 'Amortiguador', key: 'shock' },
    { label: 'Motor', key: 'motor_modelo' },
    { label: 'Batería', key: 'bateria_wh', format: (val) => `${val} Wh` },
    { label: 'Display', key: 'display' },
    { label: 'Frenos', key: 'frenos_modelo' },
    { label: 'Cambio', key: 'transmision_modelo' },
    { label: 'Ruedas', key: 'wheelset' },
    { label: 'Neumático Del.', key: 'tire_f' }
];

const TotemSeriesDetail = () => {
    const { serieName } = useParams();
    const navigate = useNavigate();
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [detailSwiperInstance, setDetailSwiperInstance] = useState(null);
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal

    const safeSerieName = serieName ? serieName.toLowerCase() : '';
    const seriesConfig = seriesHeaderImages[safeSerieName] || seriesHeaderImages.default;
    const headerImage = seriesConfig.image;

    // Idle timer to reset to start screen after 60s of inactivity
    useEffect(() => {
        let timeout;
        const resetState = () => {
            navigate('/totem');
        };

        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(resetState, 60000); // 1 minute
        };

        window.addEventListener('touchstart', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('scroll', resetTimer, true);

        resetTimer();

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('touchstart', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('scroll', resetTimer, true);
        };
    }, [navigate]);

    useEffect(() => {
        const fetchSeriesAndBikes = async () => {
            setLoading(true);
            try {
                // 1. Fetch Series ID using the name from URL
                const { data: seriesData, error: seriesError } = await supabase
                    .from('series')
                    .select('id, nombre')
                    .ilike('nombre', serieName)
                    .single();

                if (seriesError && seriesError.code !== 'PGRST116') throw seriesError;

                if (seriesData) {
                    // 2. Fetch bikes for this series
                    const { data: bikesData, error: bikesError } = await supabase
                        .from('bicicletas')
                        .select('*')
                        .eq('serie_id', seriesData.id)
                        .order('modelo', { ascending: true });

                    if (bikesError) throw bikesError;
                    setBikes(bikesData || []);
                }
            } catch (error) {
                console.error('Error fetching series data for totem:', error);
            } finally {
                setLoading(false);
            }
        };

        if (serieName) {
            fetchSeriesAndBikes();
        } else {
            setLoading(false);
        }
    }, [serieName]);

    // Helper to request smaller WebP thumbnails from Supabase Storage instead of raw 4K PNGs
    const getOptimizedImageUrl = (url, width = 800) => {
        if (!url) return url;
        if (url.includes('supabase.co/storage/v1/object/public/')) {
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}width=${width}&quality=80&format=webp`;
        }
        return url;
    };

    // Preload first batch of images for immediate render
    useEffect(() => {
        if (bikes.length > 0) {
            // Preload max 3 initial bikes to keep it light but fast for the swiper start
            const initialBikes = bikes.slice(0, 3);
            initialBikes.forEach(bike => {
                if (bike.imagenes_urls && bike.imagenes_urls.length > 0) {
                    const img = new Image();
                    img.src = getOptimizedImageUrl(bike.imagenes_urls[0], 800);
                }
            });
        }
    }, [bikes]);

    const goBack = () => {
        navigate('/totem');
    };

    if (loading) {
        return (
            <div className="w-screen h-[1920px] max-h-screen bg-zinc-950 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-6 mb-12 animate-pulse">
                    <img src={raymonLogo} alt="Raymon Logo" className="h-16 w-auto object-contain brightness-0 invert" />
                    <div className="w-32 h-1 bg-white/30 rounded-full" />
                    <img src={proomtbLogo} alt="ProoMTB Logo" className="h-24 w-auto object-contain" />
                </div>
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white"></div>
                <p className="text-white text-2xl mt-8 font-bold tracking-widest uppercase">Cargando Serie</p>
            </div>
        );
    }

    const currentBike = bikes[activeIndex];
    const miniSpecs = currentBike ? [
        { label: 'Horquilla', value: currentBike.horquilla || '-', icon: ArrowUpCircle },
        { label: 'Ruedas', value: currentBike.tamano_rueda || '29"', icon: Activity },
        { label: 'Motor', value: currentBike.motor_modelo || '-', icon: Zap },
        { label: 'Batería', value: currentBike.bateria_wh ? `${currentBike.bateria_wh}Wh` : '-', icon: Battery },
    ] : [];

    return (
        <div className="w-screen h-[1920px] max-h-screen flex flex-col bg-zinc-950 font-sans select-none overflow-hidden relative animate-in fade-in duration-500">
            
            {/* Background Nebula Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[100px] rounded-full animate-pulse delay-1000"></div>
            </div>

            {/* Top Navigation Bar - Sticky Glassmorphic */}
            <div className={`bg-black/40 backdrop-blur-xl text-white shrink-0 shadow-2xl z-20 pb-4 relative flex flex-col justify-between border-b border-white/5`}>
                {/* Background Media Header for Series */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img src={headerImage} className="w-full h-full object-cover opacity-30 mix-blend-lighten" alt={serieName} />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
                </div>

                <div className={`p-8 flex items-center justify-between relative z-10`}>
                    <button onClick={goBack} className="flex items-center text-zinc-300 hover:text-white transition-colors active:scale-95 bg-white/5 backdrop-blur-md px-6 py-4 rounded-full border border-white/10 shadow-lg">
                        <svg width="40" height="40" className="mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        <span className="text-3xl font-bold uppercase tracking-widest">Catálogo</span>
                    </button>

                    <div className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-6 drop-shadow-2xl opacity-80`}>
                        <img src={raymonLogo} alt="Raymon" className="h-8 w-auto object-contain brightness-0 invert" />
                        <div className="w-px h-10 bg-white/20" />
                        <img src={proomtbLogo} alt="ProoMTB" className="h-12 w-auto object-contain" />
                    </div>

                    <div className="text-right">
                        <p className="text-zinc-500 text-2xl tracking-widest uppercase font-black italic">Serie</p>
                        <p className={`text-white font-black uppercase italic drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] text-5xl mt-1`}>
                            {serieName}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Vertical scroll */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative w-full pb-48 z-10">
                {bikes.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-12">
                        <svg className="w-40 h-40 text-white/10 mb-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></svg>
                        <h3 className="text-5xl font-black text-white/20 uppercase tracking-tighter italic">No hay modelos disponibles</h3>
                    </div>
                ) : (
                    <div className="flex flex-col items-center w-full">

                        {/* 3D Carousel Section with Background Image */}
                        <div className="w-full relative z-10 mt-16 mb-24 px-8">
                            {/* Injected Background Image for the Carousel specifically */}
                            <div className="absolute inset-0 z-[-1] rounded-[5rem] overflow-hidden mx-8 border border-white/5">
                                <img src={headerImage} className="w-full h-full object-cover opacity-20" alt={serieName} />
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl"></div>
                            </div>

                            <div className="relative h-[750px] flex items-center justify-center pt-8 pb-16">
                                <Swiper
                                    effect={'coverflow'}
                                    grabCursor={true}
                                    centeredSlides={true}
                                    slidesPerView={'auto'}
                                    coverflowEffect={{
                                        rotate: 0,
                                        stretch: 0,
                                        depth: 150,
                                        modifier: 2.5,
                                        slideShadows: false,
                                    }}
                                    loop={false}
                                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                                    onSwiper={setSwiperInstance}
                                    modules={[EffectCoverflow, Navigation]}
                                    className="w-full h-full"
                                >
                                    {bikes.map((bike, index) => (
                                        <SwiperSlide key={bike.id} className={`!w-[85vw] !h-full flex items-center justify-center transition-all duration-700 ${index === activeIndex ? 'scale-115 opacity-100 z-10' : 'scale-90 opacity-20 blur-[4px]'}`}>
                                            <div className="relative w-full h-full flex flex-col items-center justify-center p-8" onClick={() => {
                                                if (index === activeIndex) {
                                                    setSelectedProduct(bike);
                                                    setSelectedColorIndex(0);
                                                    setIsModalOpen(true);
                                                }
                                                else swiperInstance?.slideTo(index);
                                            }}>
                                                <div className="relative aspect-[16/9] w-full flex items-center justify-center">
                                                    {bike.imagenes_urls?.length > 0 ? (
                                                        <img
                                                            src={getOptimizedImageUrl(bike.imagenes_urls[0], 1200)}
                                                            alt={bike.modelo}
                                                            className="w-[120%] h-[120%] object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.8)] transition-opacity duration-300"
                                                            style={{ contentVisibility: index > 3 ? 'auto' : 'visible' }}
                                                            loading={index < 3 ? "eager" : "lazy"}
                                                            decoding="async"
                                                        />
                                                    ) : (
                                                        <div className="text-white/10 font-black tracking-widest uppercase text-4xl italic">SIN IMAGEN</div>
                                                    )}
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>

                        {/* Active Bike Info */}
                        {currentBike && (
                            <div className="w-full px-16 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-12 duration-700" key={currentBike.id}>
                                <div className="mb-4">
                                    <span className="text-purple-400 text-3xl font-black uppercase tracking-[0.4em] italic mb-4 block">SERIE {serieName}</span>
                                    <h2 className="text-[8rem] font-black uppercase tracking-tighter mb-8 text-white italic leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                        {currentBike.modelo}
                                    </h2>
                                </div>
                                <div className="text-6xl font-black text-white mb-16 inline-block bg-white/5 backdrop-blur-xl px-14 py-8 rounded-full border border-white/10 shadow-2xl italic tracking-tighter">
                                    {formatPrice(currentBike.precio_eur, 'bikes')}
                                </div>

                                {/* Mini Specs Grid */}
                                <div className="grid grid-cols-4 gap-12 w-full max-w-6xl bg-white/[0.03] backdrop-blur-2xl rounded-[4rem] p-12 shadow-2xl border border-white/5 mb-24">
                                    {miniSpecs.map((spec, idx) => (
                                        <div key={idx} className="flex flex-col items-center text-center group">
                                            <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner mb-6 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                                                <spec.icon className="w-12 h-12" />
                                            </div>
                                            <div className="text-xl text-zinc-500 uppercase tracking-widest font-black mb-3">{spec.label}</div>
                                            <div className="text-3xl font-black text-white leading-tight px-4 italic">{spec.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Call to action */}
                                <button
                                    onClick={() => {
                                        setSelectedProduct(currentBike);
                                        setSelectedColorIndex(0);
                                        setIsModalOpen(true);
                                    }}
                                    className="bg-white text-black text-5xl font-black uppercase tracking-[0.2em] py-10 px-32 rounded-full shadow-[0_30px_60px_rgba(255,255,255,0.1)] active:scale-95 transition-all flex items-center justify-center w-full max-w-5xl group italic"
                                >
                                    Ficha Técnica
                                    <svg className="w-12 h-12 ml-8 transform group-hover:translate-x-4 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        )}

                        {/* Series Marketing Section */}
                        {serieName && seriesMarketingData[serieName.toLowerCase()] && (
                            <div className="mt-32 pt-24 bg-gradient-to-b from-white/[0.02] to-transparent w-full border-t border-white/5 pb-32 rounded-[5rem] relative z-10">
                                {seriesMarketingData[serieName.toLowerCase()].map((section, idx) => (
                                    <div key={idx} className={`flex flex-col ${section.imageRight ? 'md:flex-row' : 'md:flex-row-reverse'} items-center p-20 max-w-[1600px] mx-auto gap-24 ${idx !== seriesMarketingData[serieName.toLowerCase()].length - 1 ? 'border-b border-white/5' : ''}`}>

                                        {/* Text Block */}
                                        <div className="flex-1 space-y-12 text-left px-8">
                                            <h2 className="text-7xl lg:text-[6rem] font-black text-white uppercase leading-[0.9] tracking-tighter whitespace-pre-line italic drop-shadow-2xl">
                                                {section.title}
                                            </h2>
                                            <div className="space-y-8 text-3xl text-zinc-400 leading-relaxed font-medium">
                                                {section.text.map((paragraph, pIdx) => (
                                                    <p key={pIdx} className={pIdx === section.text.length - 1 ? 'font-black text-white tracking-tight italic border-l-4 border-purple-500 pl-8 py-2' : ''}>
                                                        {paragraph}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Image Block */}
                                        <div className="flex-1 w-full flex justify-center">
                                            <div className="relative w-full max-w-[900px] aspect-[4/3] rounded-[4rem] overflow-hidden bg-white/[0.02] shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-white/5">
                                                <img
                                                    src={section.image}
                                                    alt="Marketing Detail"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent"></div>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                )}
            </div>

            {/* Modal: Ficha Técnica Completa - Dark Mode */}
            {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col animate-in slide-in-from-bottom-12 duration-700">
                    {/* Header Pinned */}
                    <div className="flex items-center justify-between p-10 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 shrink-0 z-30 shadow-2xl relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="bg-white text-black px-10 py-5 rounded-full text-2xl font-black uppercase tracking-widest flex items-center shadow-2xl active:scale-95 transition-transform"
                        >
                            <svg width="36" height="36" className="mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            Cerrar
                        </button>
                        <h2 className="text-5xl font-black uppercase tracking-tighter text-white flex-1 text-center pr-32 italic">
                            {selectedProduct.modelo}
                        </h2>
                    </div>

                    {/* Scrollable Modal Content */}
                    <div className="flex-1 overflow-y-auto no-scrollbar pb-48">
                        {/* Top Image Hero with Color Options */}
                        <div className="w-full h-[45vh] bg-white/[0.02] flex items-center justify-center relative border-b border-white/5 overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent"></div>
                            {selectedProduct.imagenes_urls?.length > 0 ? (
                                <>
                                    {/* Main Product Images Swiper */}
                                    <div className="w-full h-full pb-12 pt-16">
                                        <Swiper
                                            grabCursor={true}
                                            slidesPerView={1}
                                            pagination={{ clickable: true, dynamicBullets: true }}
                                            modules={[Pagination]}
                                            onSwiper={setDetailSwiperInstance}
                                            onSlideChange={(swiper) => {
                                                if (selectedProduct.colores && swiper.activeIndex < selectedProduct.colores.length) {
                                                    setSelectedColorIndex(swiper.activeIndex);
                                                }
                                            }}
                                            className="w-full h-full"
                                        >
                                            {selectedProduct.imagenes_urls.map((url, idx) => (
                                                <SwiperSlide key={idx} className="flex items-center justify-center w-full h-full pb-8">
                                                    <img
                                                        src={getOptimizedImageUrl(url, 1400)}
                                                        alt={`${selectedProduct.modelo} vista ${idx + 1}`}
                                                        className="w-[95%] h-[95%] max-w-[1400px] object-contain drop-shadow-[0_60px_80px_rgba(0,0,0,0.9)] transition-all duration-700"
                                                        loading={idx === 0 ? "eager" : "lazy"}
                                                        decoding="async"
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>

                                    {/* Color Selection Palette Overlay */}
                                    {selectedProduct.colores && selectedProduct.colores.length > 1 && (
                                        <div className="absolute right-12 bottom-12 z-20 flex flex-col gap-6 bg-white/5 backdrop-blur-3xl p-6 rounded-[3rem] shadow-2xl border border-white/10">
                                            {selectedProduct.colores.map((colorStr, idx) => {
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (idx < selectedProduct.imagenes_urls.length) {
                                                                setSelectedColorIndex(idx);
                                                                if (detailSwiperInstance) {
                                                                    detailSwiperInstance.slideTo(idx);
                                                                }
                                                            }
                                                        }}
                                                        className={`w-20 h-20 rounded-full border-4 shadow-2xl transition-all ${selectedColorIndex === idx
                                                            ? 'border-white scale-115 shadow-[0_0_30px_rgba(255,255,255,0.4)]'
                                                            : 'border-white/10 opacity-40 active:scale-90 hover:opacity-80'
                                                            }`}
                                                        style={{
                                                            backgroundColor: colorStr.startsWith('#') ? colorStr : colorStr,
                                                            background: colorStr.includes(' / ') ? `linear-gradient(135deg, ${colorStr.split(' / ')[0]} 50%, ${colorStr.split(' / ')[1]} 50%)` : colorStr
                                                        }}
                                                        title={colorStr}
                                                    />
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-white/10 font-black tracking-widest uppercase text-4xl italic">Sin Imagen</div>
                            )}
                        </div>

                        {/* Specs Grid */}
                        <div className="p-16 lg:p-24 max-w-[1400px] mx-auto">
                            <h3 className="text-4xl font-black uppercase tracking-[0.3em] text-zinc-600 mb-16 border-b border-white/5 pb-8 italic">
                                Especificaciones Técnicas
                            </h3>
                            <div className="grid grid-cols-2 gap-x-16 gap-y-12">
                                {Object.entries({
                                    'Motor': selectedProduct.motor_modelo,
                                    'Batería': selectedProduct.bateria_wh ? `${selectedProduct.bateria_wh}Wh` : null,
                                    'Cuadro': selectedProduct.cuadro_material,
                                    'Horquilla': selectedProduct.horquilla,
                                    'Amortiguador': selectedProduct.amortiguador,
                                    'Transmisión': selectedProduct.transmision_modelo,
                                    'Frenos': selectedProduct.frenos_modelo,
                                    'Tamaño de Rueda': selectedProduct.tamano_rueda
                                }).map(([key, value]) => value && (
                                    <div key={key} className="bg-white/[0.02] p-10 rounded-[3rem] border border-white/5 flex flex-col group hover:bg-white/[0.04] transition-all">
                                        <div className="text-purple-400 font-black uppercase tracking-widest mb-4 text-xl">{key}</div>
                                        <div className="text-3xl font-black text-white leading-tight break-words italic group-hover:text-purple-100">{value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sticky Call to action footer - Darkified */}
                        <div className="bg-zinc-950 p-12 text-white flex items-center justify-between sticky bottom-0 left-0 right-0 h-48 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] z-20 border-t border-white/5">
                            <div className="flex flex-col">
                                <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-2xl mb-2">PROOMTB & ROAD</p>
                                <p className="text-4xl font-black italic tracking-tighter">Escanea el código QR para comprar</p>
                            </div>
                            <div className="w-32 h-32 bg-white rounded-[2rem] p-4 flex items-center justify-center shadow-white/5 shadow-2xl">
                                <svg className="w-full h-full text-black opacity-40" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 3h8v8H3zm2 2v4h4V5zM13 3h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm13-2h-5v2h2v2h-2v2h2v-2h2v-2h1zm-5 4v2h2v-2zm4 2v2h2v-2zm-2-2h-2v2h2zm2-2h-2v2h2z" />
                                </svg>
                            </div>
                        </div>

                    </div>
                </div>
            )
            }
        </div >
    );
};

export default TotemSeriesDetail;
