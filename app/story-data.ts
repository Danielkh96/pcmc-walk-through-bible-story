const basePages = [
  { section: "起初 · In the Beginning", titleZh: "神创造天地", titleEn: "God Creates the World", zh: "起初，只有神。祂创造了天地；那时地还是空虚混沌，深渊上面一片黑暗，水覆盖着一切。但神的灵运行在水面上，黑暗并不能拦阻祂。神说：“要有光。”光立刻出现。祂把光和暗分开，称光为昼，称暗为夜。圣经的大故事从这里开始：世界不是偶然来的，光、生命、秩序与美好都出自创造主。", en: "In the beginning, there was God. He created the heavens and the earth. The earth was formless and empty; darkness lay over the deep waters. Yet the Spirit of God was moving over the waters—darkness could not stop Him. God said, “Let there be light,” and light appeared at once. He separated light from darkness, calling the light day and the darkness night. The Bible’s great story begins here: the world is not an accident. Light, life, order, and goodness come from the Creator.", reference: "创世记 Genesis 1:1–5", scene: "light", image: "/genesis-creation.png" },
  { section: "第二至五日 · Days Two to Five", titleZh: "神使世界有秩序", titleEn: "God Gives the World Order", zh: "第二日，神造穹苍，把水分为上下，称穹苍为天。第三日，神使天下的水聚在一处，让旱地露出来；祂称旱地为地，水聚之处为海。接着，神吩咐地发生青草、结种子的菜蔬和结果子的树，各从其类。\n\n第四日，神造两大光：大的管昼，小的管夜；又造众星，使它们管理昼夜、分定节令、日子和年岁。第五日，神创造海里的大鱼和水中各样有生命的动物，又造各样飞鸟，并赐福它们繁殖增多。神看着都是好的。", en: "On the second day God made the expanse of sky, separating the waters above from the waters below. On the third day He gathered the waters so dry ground appeared. He called the dry ground land and the gathered waters seas. Then He commanded the earth to produce vegetation: seed-bearing plants and fruit trees, each according to its kind.\n\nOn the fourth day God made the two great lights—the greater light to govern the day and the lesser light to govern the night—and also the stars, to mark seasons, days, and years. On the fifth day He created the great creatures of the sea and every living thing in the waters, as well as every kind of bird, and blessed them to multiply. God saw that it was good.", reference: "创世记 Genesis 1:6–23", scene: "garden", image: "/genesis-creation-order.png" },
  { section: "第六与第七日 · Days Six and Seven", titleZh: "按神形象被造的人", titleEn: "People Made in God’s Image", zh: "第六日，神说：“地要生出活物来，各从其类。”于是地上有牲畜、昆虫和野兽，各从其类；神看着是好的。接着神说：“我们要照着我们的形象、按着我们的样式造人。”于是神照着自己的形象造男造女，并赐福给他们。祂吩咐人要生养众多、遍满地面，也把管理海里的鱼、空中的鸟和地上各样活物的责任交给他们。\n\n神看着一切所造的都甚好。第七日，创造的工已经完成，神就歇了祂一切的工，赐福给第七日，定为圣日。神不是因为疲倦才安息；祂以安息分别这一天，显示受造世界的完成、美好与平安。", en: "On the sixth day God said, “Let the land produce living creatures according to their kinds.” So there were livestock, creatures that move along the ground, and wild animals, each according to its kind; and God saw that it was good. Then God said, “Let us make mankind in our image, in our likeness.” So God created male and female in His own image and blessed them. He told them to be fruitful, multiply, fill the earth, and rule over the fish, birds, and every living thing.\n\nGod saw everything He had made, and it was very good. By the seventh day the work of creation was complete. God rested from all His work, blessed the seventh day, and made it holy. God did not rest because He was tired; He set the day apart to show the completion, goodness, and peace of His created world.", reference: "创世记 Genesis 1:24–2:3", scene: "people", image: "/genesis-day-six.png" },
  { section: "伊甸园 · The Garden", titleZh: "神所预备的家园", titleEn: "The Home God Prepared", zh: "神在东方的伊甸立了一个园子，把所造的人安置在那里。园中有各样悦人眼目、好作食物的树；有河从伊甸流出，滋润大地。生命树也在园中。神给亚当一项有意义的工作：修理并看守园子。这不是惩罚，而是托付。人在神的同在与丰富供应中，可以工作、欣赏、守护，并且与创造主同行。", en: "God planted a garden in Eden and placed the man He had made there. The garden held every kind of tree that was pleasing to the eye and good for food. A river flowed out of Eden to water the land, and the tree of life stood in the garden. God gave Adam meaningful work: to work the garden and take care of it. This was not a punishment, but a trust. In God’s presence and generous provision, people could work, enjoy, protect, and walk with their Creator.", reference: "创世记 Genesis 2:8–15", scene: "tree", image: "/genesis-eden-work.png" },
  { section: "界限与礼物 · Gift and Boundary", titleZh: "丰富之中，一个清楚的命令", titleEn: "Abundance and One Clear Command", zh: "神对亚当说，园中各样树上的果子都可以随意吃；只有分别善恶树上的果子不可吃。这个命令不是把美好从人手中夺走，而是在丰盛里给人一个学习信靠神的机会。神也看见亚当独居不好。祂使各样走兽和飞鸟来到亚当面前，亚当给它们起名；但没有一个能成为他的配偶。于是神造女人，把她带到亚当面前。两人赤身露体，并不羞耻。", en: "God told Adam that he was free to eat from every tree in the garden except the tree of the knowledge of good and evil. This command did not take goodness away; it gave people a chance to trust God within great abundance. God also saw that it was not good for Adam to be alone. He brought the animals and birds to Adam to name, yet none was a fitting partner. Then God made a woman and brought her to Adam. The two were naked and felt no shame.", reference: "创世记 Genesis 2:16–25", scene: "tree", image: "/genesis-command.png" },
  { section: "试探 · Temptation", titleZh: "蛇使人怀疑神的话", titleEn: "The Serpent Questions God’s Word", zh: "蛇比田野一切的活物更狡猾。它问女人：“神岂是真说，不许你们吃园中所有树上的果子吗？”它把神慷慨的供应，扭曲成一种限制。女人回答园中果子都可吃，只是那棵树不可吃，也不可摸，免得死。蛇却直接否认神的话，又暗示神是因为不愿人像祂一样知道善恶，才设下这个命令。试探从怀疑神的良善开始。", en: "The serpent was more crafty than any wild animal God had made. It asked the woman, “Did God really say you must not eat from any tree in the garden?” It twisted God’s generous provision into a restriction. The woman answered that they could eat from the trees, except that one tree; they must not eat from it or they would die. But the serpent directly denied God’s word and suggested that God was keeping something good from them. Temptation began by making God’s goodness seem doubtful.", reference: "创世记 Genesis 3:1–5", scene: "choice", image: "/genesis-serpent.png" },
  { section: "人的选择 · A Human Choice", titleZh: "人伸手摘取禁果", titleEn: "People Reach for the Forbidden Fruit", zh: "女人看见那棵树的果子好作食物、悦人眼目，又觉得能使人有智慧。她摘下果子吃了，也给与她同在的亚当，他也吃了。那一刻，他们没有把神当作可信靠的主，反而想自己决定何为善、何为恶。紧接着，他们的眼睛明亮，发现自己赤身露体，就拿无花果树的叶子编作裙子。原本坦然的关系，立刻被羞耻取代。", en: "The woman saw that the fruit was good for food, pleasing to the eye, and desirable for gaining wisdom. She took some and ate it. She also gave some to Adam, who was with her, and he ate it. In that moment, they did not trust God as their good Lord; they chose to decide good and evil for themselves. At once their eyes were opened. They realized they were naked and sewed fig leaves together for coverings. A relationship once open and free was suddenly filled with shame.", reference: "创世记 Genesis 3:6–7", scene: "choice" },
  { section: "躲藏 · Hiding", titleZh: "“你在哪里？”", titleEn: "“Where Are You?”", zh: "天起了凉风，亚当和夏娃听见神在园中行走的声音，就躲在树木中间。神呼唤亚当：“你在哪里？”亚当回答说，他害怕，因为自己赤身露体。神问他们是否吃了那棵树的果子。亚当把责任推给女人，女人又说蛇引诱了她。罪不只使人违背神，也使人害怕神、躲避神，并把责任推给别人。", en: "As the cool of the day came, Adam and Eve heard God walking in the garden and hid among the trees. God called to Adam, “Where are you?” Adam answered that he was afraid because he was naked. God asked whether they had eaten from the tree. Adam pushed blame toward the woman, and the woman said the serpent had deceived her. Sin does not only lead people to disobey God; it makes them fear Him, hide from Him, and pass blame to others.", reference: "创世记 Genesis 3:8–13", scene: "shadow" },
  { section: "离开伊甸 · Leaving Eden", titleZh: "罪的后果，也有应许", titleEn: "Consequences—and a Promise", zh: "神宣告罪带来的后果：蛇受咒诅；女人在生产和关系中经历痛苦；男人面对劳苦与受咒诅的土地。死亡也进入人的经验中。可是，在审判的话语中，神给出盼望：女人的后裔终会伤蛇的头。神为亚当和夏娃用皮子做衣服遮盖他们，然后把他们送出伊甸园，免得他们在罪中永远吃生命树的果子。门外有基路伯守着通往生命树的路。", en: "God announced the consequences of sin: the serpent was cursed; the woman would know pain in childbirth and relationships; the man would face painful toil from a cursed ground. Death entered human experience. Yet within the words of judgment, God gave hope: the woman’s offspring would one day crush the serpent’s head. God made garments of skin for Adam and Eve and clothed them. Then He sent them out of Eden, guarding the way to the tree of life so that they would not live forever in their sinful condition.", reference: "创世记 Genesis 3:14–24", scene: "shadow" },
  { section: "两兄弟 · Two Brothers", titleZh: "该隐与亚伯献祭", titleEn: "Cain and Abel Bring Offerings", zh: "亚当和夏娃有两个儿子。该隐耕种土地，亚伯牧养羊群。日子满足时，两人都向神献供物：该隐拿地里的出产，亚伯从羊群中拿头生的和脂油献上。耶和华看中了亚伯和他的供物，却没有看中该隐和他的供物。该隐就大大地发怒，变了脸色。神没有立刻丢弃他，反而温柔地问他为什么发怒。", en: "Adam and Eve had two sons. Cain worked the soil, while Abel kept flocks. When the time came, both brought offerings to God: Cain brought produce from the ground, and Abel brought the firstborn of his flock and their fat portions. The Lord looked with favor on Abel and his offering, but not on Cain and his offering. Cain became very angry and his face fell. God did not cast him away; He asked Cain gently why he was angry.", reference: "创世记 Genesis 4:1–6", scene: "field" },
  { section: "罪伏在门前 · Sin at the Door", titleZh: "该隐没有制伏愤怒", titleEn: "Cain Does Not Master His Anger", zh: "神对该隐说：“你若行得好，岂不蒙悦纳？”又警告他：罪伏在门前，恋慕他，他却要制伏罪。这是一句严肃又充满机会的话。可是该隐没有回转。他和亚伯到了田间，竟起来杀了弟弟。神问：“你兄弟亚伯在哪里？”该隐回答：“我不知道！我岂是看守我兄弟的吗？”亚伯的血从地里向神呼求。", en: "God told Cain, “If you do what is right, will you not be accepted?” He warned him that sin was crouching at the door and desired to have him, but Cain must rule over it. This was a serious warning and also an invitation to turn back. Cain did not. While he and Abel were in the field, Cain killed his brother. God asked, “Where is your brother Abel?” Cain replied, “I don’t know. Am I my brother’s keeper?” But Abel’s blood cried out to God from the ground.", reference: "创世记 Genesis 4:7–10", scene: "field" },
  { section: "败坏的世界 · A Corrupted World", titleZh: "挪亚在神眼前蒙恩", titleEn: "Noah Finds Favor", zh: "世代过去，人的罪恶越来越大。耶和华看见人在地上罪恶很大，终日所思想的尽都是恶；地上也因人充满了强暴。神为人的败坏忧伤，决定审判这已经败坏的世界。然而，挪亚在耶和华眼前蒙恩。经文特别说，挪亚是个义人，在当时的世代是个完全人；他与神同行。在黑暗的时代，他仍选择信靠神。", en: "Generations passed, and human evil grew greater. The Lord saw that people’s thoughts and intentions were continually bent toward evil, and the earth was filled with violence because of them. God was grieved by human corruption and determined to judge the ruined world. Yet Noah found favor in the eyes of the Lord. Scripture says Noah was righteous and blameless among the people of his time; he walked faithfully with God. In a dark generation, he still chose to trust God.", reference: "创世记 Genesis 6:5–13", scene: "rain" },
  { section: "方舟的预备 · Preparing the Ark", titleZh: "神预备拯救的道路", titleEn: "God Prepares a Way of Rescue", zh: "神告诉挪亚，洪水将要来到，毁灭地上一切有气息的活物；但祂也说要与挪亚立约。神详细吩咐他用歌斐木造方舟，里面要有房间，里外都抹上松香，并清楚说明方舟的尺寸。挪亚要带妻子、儿子和儿妇进入方舟，也要带各类活物和食物进去。挪亚没有看见洪水，却照着神所吩咐的一切去做。", en: "God told Noah that a flood would come and destroy every living thing on earth, but He also promised to establish His covenant with Noah. God gave detailed instructions: build an ark of gopher wood, make rooms in it, coat it inside and out with pitch, and follow the measurements He gave. Noah was to bring his wife, sons, daughters-in-law, animals of every kind, and food into the ark. Noah had not seen the flood, yet he did everything God commanded.", reference: "创世记 Genesis 6:14–22", scene: "ark" },
  { section: "进入方舟 · Entering the Ark", titleZh: "神亲自关上门", titleEn: "God Himself Shuts the Door", zh: "神吩咐挪亚和全家进入方舟，因为祂看见挪亚在这世代是义人。洁净的牲畜要七公七母，不洁净的牲畜一公一母；空中的飞鸟也照样进入，为要存留后裔。挪亚六百岁那年，洪水来到。动物一对一对进了方舟，正如神所吩咐。挪亚一家也进去了。七天以后，大雨开始降下；经文特别说，是耶和华把挪亚关在方舟里。", en: "God told Noah to enter the ark with his whole family, because He had found Noah righteous in that generation. Clean animals were to come in sevens, male and female; unclean animals came in pairs, as did birds, so that life could continue. In Noah’s six hundredth year, the flood came. Animals entered the ark two by two, just as God had commanded. Noah and his family entered too. After seven days the rain began, and Scripture tells us that the Lord Himself shut Noah in.", reference: "创世记 Genesis 7:1–16", scene: "ark" },
  { section: "洪水与等候 · The Flood and the Waiting", titleZh: "神记念挪亚", titleEn: "God Remembers Noah", zh: "天上的窗户敞开，深渊的泉源裂开，雨下了四十昼夜。水势增长，方舟从地面漂起；高山都被水淹没。方舟以外有气息的生命都灭绝了，只留下挪亚和与他同在方舟里的。水在地上浩大了一百五十天。然后经文说：“神记念挪亚。”祂使风吹地，水势渐退。方舟停在亚拉腊山上。挪亚放出乌鸦，又三次放出鸽子；最后鸽子不再回来，地已经干了。", en: "The windows of heaven opened and the springs of the great deep burst forth. Rain fell for forty days and nights. The waters rose, lifting the ark from the ground, until even the high mountains were covered. Every breathing creature outside the ark perished; only Noah and those with him in the ark remained. The waters prevailed for one hundred and fifty days. Then Scripture says, “God remembered Noah.” He sent a wind over the earth, and the waters began to recede. The ark rested on the mountains of Ararat. Noah sent out a raven, then a dove three times; at last the dove did not return, and the land was dry.", reference: "创世记 Genesis 7:17–8:14", scene: "dove" },
  { section: "彩虹之约 · The Rainbow Covenant", titleZh: "神守约的记号", titleEn: "The Sign of God’s Covenant", zh: "神吩咐挪亚和全家带着活物离开方舟。挪亚筑了一座坛，向耶和华献祭敬拜。神与挪亚、他的后代和一切活物立约：祂不再用洪水毁灭全地，也不再让洪水成为灭绝凡有血肉的灾害。神把彩虹放在云中，作为祂守约的记号。彩虹提醒我们，神认真对待罪，也在审判中施行怜悯；祂信实地记念祂的应许。", en: "God told Noah, his family, and the living creatures to leave the ark. Noah built an altar and worshiped the Lord with an offering. God made a covenant with Noah, his descendants, and every living creature: never again would a flood destroy the whole earth or wipe out all life. God placed the rainbow in the clouds as the sign of His covenant. The rainbow reminds us that God takes sin seriously, yet shows mercy even in judgment. He faithfully remembers His promises.", reference: "创世记 Genesis 8:15–22; 9:8–17", scene: "rainbow" },
];

const extraDetails: Record<string, { zh: string; en: string }> = {
  "神创造天地": { zh: "这是头一日。有晚上，有早晨。神以祂的话使光出现，也为光和暗分别界限；昼夜从此开始轮流。", en: "This was the first day: there was evening, and there was morning. By His word God brought light into being and set a boundary between light and darkness; day and night began their rhythm." },
  "神使世界有秩序": { zh: "第二日有天空；第三日有陆地、海洋和植物；第四日有日月星辰；第五日有海里的活物和空中的飞鸟。每一样都照神所吩咐的出现。", en: "The second day brought the sky; the third, land, seas, and plants; the fourth, sun, moon, and stars; the fifth, sea creatures and birds. Everything appeared as God commanded." },
  "按神形象被造的人": { zh: "第六日，神先造地上的牲畜、昆虫和野兽，然后照自己的形象造人。第七日，神完成创造之工，安息、赐福，并定这日为圣日。", en: "On the sixth day God first made livestock, creatures that move along the ground, and wild animals, then made people in His own image. On the seventh day He completed His work, rested, blessed the day, and made it holy." },
  "神所预备的家园": { zh: "伊甸有河从园中流出，又分为四道。神把人安置在那里，不是要人闲着，而是要他修理、看守这份美好的托付。", en: "A river flowed out of Eden and became four headwaters. God placed the man in the garden not to be idle, but to work it and keep this beautiful trust." },
  "丰富之中，一个清楚的命令": { zh: "园中各样树上的果子，亚当都可以随意吃；只有分别善恶树上的果子不可吃。随后，神把活物带到亚当面前，让他给它们起名；最后，神亲自为他预备了一位配偶。", en: "Adam was free to eat from every tree in the garden except the tree of the knowledge of good and evil. Then God brought the animals to Adam for him to name, and at last God Himself prepared a partner for him." },
  "蛇使人怀疑神的话": { zh: "蛇没有先直接叫人犯罪，而是用问题扭曲神的命令，又否认犯罪会带来死亡。它的声音把神描绘成吝啬的，和经文中慷慨供应的神完全相反。", en: "The serpent did not begin with a direct command to sin. It questioned and distorted God’s command, then denied death would follow. It painted God as withholding, the opposite of the generous God Scripture has shown." },
  "人伸手摘取禁果": { zh: "夏娃看见果子好作食物、悦人眼目，又觉得能使人有智慧，于是吃了；亚当也吃了。经文没有为他们找借口，却让我们看见不信任神如何进入具体的选择。", en: "Eve saw that the fruit was good for food, pleasing to the eye, and desirable for wisdom, so she ate; Adam ate too. Scripture gives no excuse, but shows how distrust of God enters a real choice." },
  "“你在哪里？”": { zh: "神的问题不是因为祂不知道亚当藏在哪里，而是呼唤犯罪的人从躲藏中出来，面对真相。亚当的恐惧、遮掩与推诿，显示罪已经破坏人与神、人与人之间的坦然。", en: "God’s question was not because He lacked information; it called the hidden sinner out to face the truth. Adam’s fear, covering, and blame show how sin had broken openness with God and with one another." },
  "罪的后果，也有应许": { zh: "在审判中，神也说女人的后裔要伤蛇的头；这成为圣经救赎故事最早的盼望。神给他们衣服，显出祂在惩罚中仍有怜悯。", en: "Within judgment, God said the woman’s offspring would crush the serpent’s head—an early promise of the Bible’s rescue story. By clothing them, God showed mercy even as He judged." },
  "该隐与亚伯献祭": { zh: "亚伯从羊群中拿头生的和脂油献上；该隐拿地里的出产献上。耶和华看中了亚伯和他的供物，却没有看中该隐和他的供物。该隐因此大大地发怒，脸色也变了。", en: "Abel brought firstborn animals from his flock and their fat portions; Cain brought produce from the ground. The Lord looked with favor on Abel and his offering, but not on Cain and his offering. Cain became very angry, and his face fell." },
  "该隐没有制伏愤怒": { zh: "神先警告该隐，罪伏在门前；他本可以转回，却让怒气发展成暴力。杀害亚伯后，该隐受咒诅离开那地，成为流离飘荡的人；神仍给他一个记号，免得人任意杀他。", en: "God warned Cain that sin was crouching at the door. Cain could have turned back, but allowed anger to become violence. After Abel’s murder, Cain was cursed from the ground and became a restless wanderer; God still marked him so that others would not kill him freely." },
  "挪亚在神眼前蒙恩": { zh: "挪亚是拉麦的儿子，有闪、含、雅弗三个儿子。经文将全地的败坏和挪亚与神同行放在一起，显出神的审判不是任意的，而恩典也不是人配得的。", en: "Noah, the son of Lamech, had three sons: Shem, Ham, and Japheth. Scripture places the corruption of the earth beside Noah’s walk with God, showing that judgment was not arbitrary and grace was not earned." },
  "神预备拯救的道路": { zh: "方舟长三百肘、宽五十肘、高三十肘，有上中下三层，并有门和透光处。神详细的命令说明拯救不是模糊的主意，而是祂亲自预备的道路。", en: "The ark was three hundred cubits long, fifty cubits wide, and thirty cubits high, with lower, middle, and upper decks, a door, and an opening for light. God’s detailed command shows rescue was not vague—it was a way He Himself prepared." },
  "神亲自关上门": { zh: "在七天等候后，洪水的泉源裂开，天上的窗户也敞开。经文强调动物按神所吩咐的进入，而最后关门的是耶和华自己。", en: "After seven days of waiting, the springs of the deep burst forth and the windows of heaven opened. Scripture emphasizes that the animals entered as God commanded, and that the Lord Himself shut the door." },
  "神记念挪亚": { zh: "洪水后，水渐退，山顶显现。鸽子第一次找不着落脚之地；第二次衔着新拧下的橄榄叶回来；第三次出去就不再回来。挪亚耐心等候神的时间。", en: "After the flood, the waters receded and mountain peaks appeared. The dove first found no resting place; the second time it returned with a freshly plucked olive leaf; the third time it did not return. Noah waited patiently for God’s timing." },
  "神守约的记号": { zh: "这约不只对挪亚一家，也对他们的后代和地上一切活物。神说祂看见云中的虹，就记念祂与地上一切有血肉之物所立的永约。", en: "This covenant was not only with Noah’s family, but with their descendants and every living creature. God said that when He sees the rainbow in the clouds, He will remember His everlasting covenant with all life on earth." },
};

const reflectionAfter: Record<string, { section: string; titleZh: string; titleEn: string; questionsZh: string[]; questionsEn: string[] }> = {
  "按神形象被造的人": {
    section: "故事一 · Reflection",
    titleZh: "反思：神创造天地与人",
    titleEn: "Reflect: God Creates the World and People",
    questionsZh: [
      "你通常会用什么来衡量自己的价值：成绩、外表、能力、朋友的认可，还是别的？“按神形象被造”会怎样改变这个看法？",
      "神把世界交给人管理。作为学生或年轻人，你觉得自己能从哪一件小事开始，好好管理神交托给你的时间、身体、关系或环境？",
      "神在第七日安息。你平时真的有“休息”吗？还是只是换一种方式继续滑手机、赶功课和焦虑？",
      "如果你相信自己不是偶然存在的，你觉得神可能希望你怎样使用自己的恩赐？",
    ],
    questionsEn: [
      "What usually shapes your sense of worth—grades, appearance, ability, or other people’s approval? How does being made in God’s image change that?",
      "God entrusted people with caring for the world. What is one small way you can steward your time, body, relationships, or environment well?",
      "God rested on the seventh day. Do you experience real rest, or simply switch to scrolling, studying, and worrying?",
      "If you believe you are not here by accident, how might God want you to use your gifts?",
    ],
  },
  "罪的后果，也有应许": {
    section: "故事二 · Reflection",
    titleZh: "反思：伊甸园、试探与人犯罪",
    titleEn: "Reflect: Eden, Temptation, and the Fall",
    questionsZh: [
      "夏娃面对试探时，开始怀疑神是否真的为她好。你在哪些事情上也容易有这种想法：例如感情、未来、金钱、自由或选择？",
      "当身边朋友都在做一件你觉得不太对的事时，你通常会怎样回应？最难坚持的地方是什么？",
      "亚当和夏娃犯罪后先躲起来，也互相推卸责任。你犯错时比较像哪一种：逃避、解释、怪环境、怪别人，还是愿意承认？",
      "你觉得“自由”是想做什么就做什么，还是有能力选择真正对自己和别人好的事？为什么？",
      "如果今天神问你：“你在哪里？”你觉得祂可能在问你生命中的哪一个部分？",
    ],
    questionsEn: [
      "Eve began to doubt whether God truly wanted what was good for her. In what areas do you find yourself asking the same question—relationships, future plans, money, freedom, or choices?",
      "When friends are doing something you believe is not right, how do you usually respond? What makes it hardest to stand firm?",
      "After they sinned, Adam and Eve hid and blamed each other. When you are wrong, do you avoid, explain, blame, or admit it?",
      "Is freedom simply doing whatever we want, or having the ability to choose what is truly good for ourselves and others? Why?",
      "If God asked you today, “Where are you?” what part of your life might He be asking about?",
    ],
  },
  "该隐没有制伏愤怒": {
    section: "故事三 · Reflection",
    titleZh: "反思：该隐与亚伯",
    titleEn: "Reflect: Cain and Abel",
    questionsZh: [
      "你有没有因为比较而感到嫉妒、失落或不甘心？比较常发生在什么方面：成绩、外表、家庭、感情、机会或社交媒体？",
      "该隐生气时没有及时处理，最后伤害了别人。你生气时通常会怎样表现：沉默、冷战、说重话、发朋友圈，还是直接爆发？",
      "当你发现自己正在嫉妒或愤怒时，什么方法能帮助你暂停下来，不让情绪替你做决定？",
      "“我岂是看守我兄弟的吗？”你认为我们对身边朋友的情绪、困难和选择，应该关心到什么程度？",
      "你有没有一个需要主动关心、和好，或向他道歉的人？",
    ],
    questionsEn: [
      "Have comparisons ever made you jealous, disappointed, or resentful? Where does this happen most—grades, appearance, family, relationships, opportunities, or social media?",
      "Cain did not deal with his anger and hurt someone else. When you are angry, do you go silent, give the cold shoulder, say hurtful words, post online, or explode?",
      "When you notice jealousy or anger rising, what could help you pause rather than let that emotion make decisions for you?",
      "Cain asked, “Am I my brother’s keeper?” How far should our care for a friend’s emotions, struggles, and choices go?",
      "Is there someone you need to reach out to, reconcile with, or apologise to?",
    ],
  },
  "神守约的记号": {
    section: "故事四 · Reflection",
    titleZh: "反思：挪亚、方舟与彩虹之约",
    titleEn: "Reflect: Noah, the Ark, and the Rainbow Covenant",
    questionsZh: [
      "挪亚在大多数人都不跟随神时仍选择顺服。你有没有因为信仰或价值观与朋友不一样，而觉得孤单或压力很大？",
      "挪亚在看不见洪水前就开始造方舟。你生命中有没有一件事，是你现在还看不见结果，却需要先忠心去做的？",
      "等待洪水退去需要很长时间。你现在正在等什么？等待中最难的是什么？",
      "彩虹提醒人神没有忘记祂的应许。低潮时，你最需要记得神的哪一种性情：祂的信实、怜悯、同在，还是带领？",
      "如果神给你一个“重新开始”的机会，你最想在哪个生活领域作出新的选择？",
    ],
    questionsEn: [
      "Noah obeyed God when most people did not. Have your faith or values ever made you feel alone or pressured among friends?",
      "Noah built the ark before he saw the flood. Is there something you need to do faithfully even though you cannot see the result yet?",
      "Waiting for the floodwaters to recede took a long time. What are you waiting for now, and what is hardest about it?",
      "The rainbow reminds us that God has not forgotten His promises. In a low season, which part of God’s character do you most need to remember: faithfulness, mercy, presence, or guidance?",
      "If God gave you an opportunity for a new beginning, in what area of life would you most want to make a new choice?",
    ],
  },
};

const withStoryDetails = basePages.map((page) => ({
  ...page,
  image: ({
    "人伸手摘取禁果": "/genesis-choice.png",
    "“你在哪里？”": "/genesis-hiding.png",
    "罪的后果，也有应许": "/genesis-leaving-eden.png",
    "该隐与亚伯献祭": "/genesis-cain-abel.png",
    "该隐没有制伏愤怒": "/genesis-cain-exile.png",
    "挪亚在神眼前蒙恩": "/genesis-noah-favor.png",
    "神预备拯救的道路": "/genesis-ark-build.png",
    "神亲自关上门": "/genesis-enter-ark.png",
    "神记念挪亚": "/genesis-dove.png",
    "神守约的记号": "/genesis-rainbow-covenant.png",
  } as Record<string, string>)[page.titleZh] ?? page.image,
  zh: `${page.zh}\n\n${extraDetails[page.titleZh].zh}`,
  en: `${page.en}\n\n${extraDetails[page.titleZh].en}`,
}));

export const detailedPages = withStoryDetails.flatMap((page) => {
  const reflection = reflectionAfter[page.titleZh];
  if (!reflection) return [page];
  return [
    page,
    {
      ...reflection,
      zh: reflection.questionsZh.map((question, index) => `${index + 1}. ${question}`).join("\n\n"),
      en: reflection.questionsEn.map((question, index) => `${index + 1}. ${question}`).join("\n\n"),
      reference: "小组讨论 · Small-group discussion",
      scene: "reflection",
      image: "/reflection-discussion.png",
      isReflection: true,
    },
  ];
});
