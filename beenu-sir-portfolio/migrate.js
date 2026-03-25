import { getCliClient } from 'sanity/cli'
import { createReadStream } from 'fs'
import { join } from 'path'
import process from 'process'

const client = getCliClient({apiVersion: '2024-01-01'})

const globalServices = [
    { title: 'Keynote Speaking', category: 'SPEAKING', code: 'BK-SC-01', description: 'Setting the standard for global summits with thought-provoking addresses that blend cinematic storytelling with actionable strategic wisdom. These sessions are designed to challenge existing paradigms and inspire institutional transformation at the highest levels of leadership.' },
    { title: 'Leadership Talks', category: 'EXECUTIVE', code: 'BK-LT-02', description: 'Curating elite leadership frameworks for global boardrooms. We dissect the nuances of power dynamics, resilient organizational culture, and the architectural principles of sustainable success in volatile markets.' },
    { title: 'Motivational Talks', category: 'POTENTIAL', code: 'BK-MT-03', description: 'Igniting the untapped potential within your workforce. These sessions combine behavioral science with high-impact storytelling to catalyze a shift from passive participation to passionate, ownership-driven execution.' },
    { title: 'TEDx Speaker', category: 'IMPACT', code: 'BK-TX-04', description: 'Distilling complex human insights into globally resonant narratives. As a TEDx veteran, I deliver high-signal ideas that challenge conventional wisdom and inspire collective action on the world stage.' },
    { title: 'Story Telling', category: 'NARRATIVE', code: 'BK-ST-05', description: 'Harnessing the power of narrative to build compelling brand identities and emotional connections. We teach leaders how to craft stories that not only resonate but drive decisive action from target audiences.' },
    { title: 'Business Consulting', category: 'STRATEGY', code: 'BK-BC-06', description: 'Providing high-value bespoke advisory for C-suite leaders. We partner with you to solve systemic challenges, optimize decision-making workflows, and build a legacy of operational excellence.' },
    { title: 'Org. Development', category: 'STRUCTURE', code: 'BK-OD-07', description: 'Strengthening the structural integrity of your organization through robust development models. We provide the scaffolding necessary for transparent, high-integrity corporate stewardship.' },
    { title: 'Process & Streamlining', category: 'OPERATIONS', code: 'BK-PS-08', description: 'Navigating the intricate landscape of operational workflows. We specialize in reducing friction during transitions, ensuring that processes are maximized for competitive advantage.' },
    { title: 'Educational Thinking', category: 'PEDAGOGY', code: 'BK-ET-09', description: 'Revolutionizing educational approaches with strategic thinking frameworks. We empower institutions to cultivate environments of relentless curiosity and profound intellectual growth.' }
];

const galleryData = [
    { filename: 'image 1.png', title: 'Leadership Development', desc: 'Engaging with future leaders in a dynamic workshop setting.' },
    { filename: 'image 2.png', title: 'Collaborative Learning', desc: 'Fostering an environment of growth and collective intelligence.' },
    { filename: 'image 3.png', title: 'Strategic Thinking', desc: 'Empowering minds with foundational leadership principles.' },
    { filename: 'image 4.png', title: 'Impactful Mentorship', desc: 'Guiding the next generation towards professional excellence.' },
    { filename: 'image 5.png', title: 'Visionary Leadership', desc: 'Building strong foundations for future organizational success.' },
    { filename: 'image 6.png', title: 'Interactive Growth', desc: 'Transforming complex concepts into actionable leadership skills.' },
    { filename: 'image 7.png', title: 'Global Impact', desc: 'Sharing insights that transcend borders and disciplines.' },
    { filename: 'image 8.png', title: 'Excellence in Action', desc: 'Showcasing dedication to transformational corporate training.' },
    { filename: 'image 9.png', title: 'Empowering Youth', desc: 'Inspiring young minds to reach their full potential.' },
    { filename: 'image 10.png', title: 'Memorable Moments', desc: 'Celebrating milestones in the journey of transformation.' }
];

async function runMigrate() {
    console.log("Migrating Engagements...");
    let order = 1;
    for (let service of globalServices) {
        await client.create({
            _type: 'engagement',
            title: service.title,
            category: service.category,
            code: service.code,
            description: service.description,
            order: order++
        });
        console.log(`Created engagement: ${service.title}`);
    }

    console.log("Migrating Gallery Images...");
    let gOrder = 1;
    for (let g of galleryData) {
        const filePath = join(process.cwd(), '../assets/gallery', g.filename);
        try {
            const asset = await client.assets.upload('image', createReadStream(filePath), { filename: g.filename });
            await client.create({
                _type: 'galleryImage',
                title: g.title,
                description: g.desc,
                image: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: asset._id }
                },
                order: gOrder++
            });
            console.log(`Uploaded & Created gallery image: ${g.title}`);
        } catch (e) {
            console.error(`Failed to process ${g.filename}:`, e.message);
        }
    }
    
    console.log("MIGRATION COMPLETE!");
}

runMigrate().catch(console.error);
