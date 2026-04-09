export const diamondSutraQuotes = [
  {
    quote: "凡所有相，皆是虛妄。若見諸相非相，則見如來。",
    explanation: "世間一切現象都是虛幻的。若能透過現象看到本質，就見到了真理。"
  },
  {
    quote: "一切有為法，如夢幻泡影，如露亦如電，應作如是觀。",
    explanation: "世間所有依條件而生的事物，都像夢、像幻覺、像水泡、像影子，應這樣看待。"
  },
  {
    quote: "應無所住，而生其心。",
    explanation: "不應執著於任何事物，而產生清淨、自然的本心。"
  },
  {
    quote: "過去心不可得，現在心不可得，未來心不可得。",
    explanation: "時間遷流不息，過去、現在、未來的心念都無法捕捉與執著。"
  },
  {
    quote: "法尚應捨，何況非法。",
    explanation: "正法就像渡河的船，過河後就該放下，何況是錯誤的觀念呢？"
  },
  {
    quote: "不應住色生心，不應住聲香味觸法生心。",
    explanation: "不應被感官世界（眼耳鼻舌身意）所牽動而產生執著心。"
  },
  {
    quote: "若以色見我，以音聲求我，是人行邪道，不能見如來。",
    explanation: "若只追求外貌或聲音來尋找真理，是偏離了正道。"
  },
  {
    quote: "離一切諸相，則名諸佛。",
    explanation: "離開對一切現象的執著，就是佛的境界。"
  },
  {
    quote: "實相者，則是非相。",
    explanation: "真正的真相，並不是我們所看到的物質表象。"
  },
  {
    quote: "是法平等，無有高下。",
    explanation: "真理在本质上是平等的，沒有優劣之分。"
  },
  {
    quote: "信心清淨，則生實相。",
    explanation: "內心清淨安定，真理自然會顯現。"
  },
  {
    quote: "忍辱波羅蜜，準說非忍辱波羅蜜，是名忍辱波羅蜜。",
    explanation: "真正的忍辱是內心不覺得自己在忍，這才是最高的智慧。"
  },
  {
    quote: "不取於相，如如不動。",
    explanation: "不被外在環境干擾，內心始終平靜穩定。"
  },
  {
    quote: "無我相，無人相，無眾生相，無壽者相。",
    explanation: "放下對自我、他人、集體及時間長短的偏見與執著。"
  },
  {
    quote: "所謂佛法者，即非佛法。",
    explanation: "佛法只是一種指引，不應死守名相而忘了本質。"
  },
  {
    quote: "於一切法，無所執著。",
    explanation: "對世間萬事萬物，都不產生強求之心。"
  },
  {
    quote: "發阿耨多羅三藐三菩提心者，於法不說斷滅相。",
    explanation: "追求最高覺悟的人，不會認為生命結束後一切就消失了，而是理解因果。"
  },
  {
    quote: "善護念諸菩薩，善付囑諸菩薩。",
    explanation: "善於守護自己的心念，也善於教導他人。"
  },
  {
    quote: "應云何住，云何降伏其心？",
    explanation: "我們應該如何安住自心，如何調伏那些煩躁不安的情緒？"
  },
  {
    quote: "如來說莊嚴佛土者，即非莊嚴，是名莊嚴。",
    explanation: "真正的美好不是外在的裝飾，而是內心的純淨。"
  },
  {
    quote: "如來者，無所從來，亦無所去，故名如來。",
    explanation: "真理既無來處也無去處，它是永恆存在的現狀。"
  },
  {
    quote: "若心有住，則為非住。",
    explanation: "如果心執著在某一點上，就無法真正安定。"
  },
  {
    quote: "一切眾生，即非眾生。",
    explanation: "從本質上看，眾生皆有佛性，不應被表象的區別所限制。"
  },
  {
    quote: "非法名為大身。",
    explanation: "真正的廣大並非指肉體，而是無邊際的智慧。"
  },
  {
    quote: "如來說一切諸相，即是非相。",
    explanation: "佛所說的一切現象，本質上都是虛幻不實的。"
  },
  {
    quote: "如來是真語者、實語者、如語者、不誑語者、不異語者。",
    explanation: "真理是真實不虛的，不隨主觀意願而改變。"
  },
  {
    quote: "無有定法，如來可說。",
    explanation: "真理沒有固定的形式，是隨著因緣隨機應變的。"
  },
  {
    quote: "一切賢聖，皆以無為法而有差別。",
    explanation: "所有的聖賢，都是因為對「無為法」的領悟程度不同而有所區別。"
  },
  {
    quote: "若人滿三千大千世界七寶以用布施...其福德甚多。",
    explanation: "以此對比，領悟經文智慧的功德，遠大於物質的施捨。"
  },
  {
    quote: "聞此經典，信心不逆，其福勝彼。",
    explanation: "聽聞此經能深信不疑，這份心靈的收穫勝過世間財富。"
  }
];

export const getDailyQuote = () => {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return diamondSutraQuotes[dayOfYear % diamondSutraQuotes.length];
};
