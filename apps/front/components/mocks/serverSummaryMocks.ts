import {ServerSummaryDto} from '@shared/dto';
import {ServerCategory} from '@shared/enums';

export const defaultServerIcon = '/logo_minecraft.png';

export const defaultServerBanner = '/minecraft_banner.png';

export const serverSummaryMocks: ServerSummaryDto[] = [
    {
        id: '1',
        online: true,
        host: 'play.example.com',
        ip_address: '192.168.0.1',
        port: 25565,
        versions: ['1.16.5', '1.17'],
        onlinePlayers: 20,
        maxPlayers: 100,
        categories: [ServerCategory.Survival, ServerCategory.Adventure],
        icon:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA' +
            'AAAFCAYAAACNbyblAAAAHElEQVQI12P4' +
            '//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
        votes: 42,
        name: 'Adv Surf server',
        ranking: 1,
        banner: defaultServerBanner,
        description: `[1.21] OPBlocks is a high-quality Minecraft Prison, Skyblock, Cobblemon/Pixelmon, and Survival SMP server featuring unique content and an amazing community, friendly staff, and awesome players like you!

BEDROCK SUPPORTED!

The Original Candy Prison
Fully Custom Skyblock
Unique Survival SMP
Parkour
Boss Fights
Mob Armor
Dungeons
Quests
Daily Challenges`,
    },
    {
        id: '2',
        online: false,
        host: 'mc.another.com',
        ip_address: undefined,
        port: 25566,
        versions: ['1.15.2'],
        onlinePlayers: 0,
        maxPlayers: 50,
        categories: [ServerCategory.Classic, ServerCategory.Vanilla],
        icon: defaultServerIcon,
        votes: 10,
        name: 'Classic MC',
        ranking: 122,
        banner: defaultServerBanner,
        description: `IP: MCSL.MANACUBE.COM [1.20 Java/Bedrock]
Over the past 10 years, 5 million players have enjoyed our unique game modes: Parkour, Skyblock, SMP, KitPvP, Factions, Prison, Earth Towny, Anarchy and Creative

Parkour: Over 2500 unique maps.
Olympus: A Greek mythology RPG. Grow as demi-gods through quests, mining, battles, and exploration.
Skyblock: Build on a secluded island and explore for upgrades.
Survival: An enhanced survival experience.
Factions: A 1.19 base building/defending game with custom mobs.
Earth: Create and rule towns or nations on a map based on satellite images of Earth.
KitPvP: Classic 1.8 PVP with top-notch anticheat.
Creative: Build freely with unlimited resources.
Our in-game currency, Cubits, can be used across all servers. Store special items in the Season Vault that never reset. Experience the game with our custom resource pack, featuring unique items, monsters, cosmetics, and more.

We host community events and offer daily chances to win Cubits and exclusive prizes. At ManaCube, we're not just a server – we're a community that promises a rich and immersive Minecraft experience. Come join us!
`,
    },
    {
        id: '3',
        name: 'HDPW',
        online: true,
        host: 'server.third.com',
        ip_address: '203.0.113.5',
        port: 25565,
        versions: ['1.18'],
        onlinePlayers: 65,
        maxPlayers: 200,
        categories: [
            ServerCategory.Hardcore,
            ServerCategory.Skyblock,
            ServerCategory.PvP,
        ],
        icon: defaultServerIcon,
        votes: 128,
        ranking: 59221,
        banner: defaultServerBanner,
        description: `Welcome to BlossomCraft,
        an excellent server known for its amazing experiences. We are a laid-back, no grief, economy, SMP server where we value community above all else.
1.20+
The server is running 1.20, and everyone is welcome as both Java and Bedrock players are free to join! We strive to have a Non-Competitive Environment which is achieved by making our server focused on PvE, having Keep-Inventory enabled, and by having No Leaderboards.
The server offers a variety of plugins that enhance the player experience while also staying true to Minecrafts roots such as keep-inv, player warps, griefprevention, and more!
Show your support for the server by voting to earn free ranks which grants perks such as extra homes, cool prefixes, chest shops, and more!
Grab a seat, get comfy and stay for a while!`,
    },
];

export default serverSummaryMocks;
