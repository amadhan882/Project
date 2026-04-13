export const CROP_IMAGES: Record<string, string> = {
  rice: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Rice_p1160004.jpg/480px-Rice_p1160004.jpg",
  maize: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Mature_maize_plant.jpg/480px-Mature_maize_plant.jpg",
  chickpea: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Ripe_Chickpeas.jpg/480px-Ripe_Chickpeas.jpg",
  kidneybeans: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Kidney_beans.jpg/480px-Kidney_beans.jpg",
  pigeonpeas: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Cajanus_cajan_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-037.jpg/480px-Cajanus_cajan_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-037.jpg",
  mothbeans: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Vigna_aconitifolia_-_moth_bean.jpg/480px-Vigna_aconitifolia_-_moth_bean.jpg",
  mungbean: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Mung_beans.jpg/480px-Mung_beans.jpg",
  blackgram: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Urad_dal.jpg/480px-Urad_dal.jpg",
  lentil: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Red_and_Green_Lentils.jpg/480px-Red_and_Green_Lentils.jpg",
  pomegranate: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Hapus_Mango.jpg/480px-Hapus_Mango.jpg",
  banana: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Platano.jpg/480px-Banana-Platano.jpg",
  mango: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Hapus_Mango.jpg/480px-Hapus_Mango.jpg",
  grapes: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Grape_bunch_02.jpg/480px-Grape_bunch_02.jpg",
  watermelon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Watermelon_seedless.jpg/480px-Watermelon_seedless.jpg",
  muskmelon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Musk_melon_2.jpg/480px-Musk_melon_2.jpg",
  apple: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/480px-Red_Apple.jpg",
  orange: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Oranges_and_orange_juice.jpg/480px-Oranges_and_orange_juice.jpg",
  papaya: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Coconuts_on_tree_02.jpg/480px-Coconuts_on_tree_02.jpg",
  coconut: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Coconut-fresh.jpg/480px-Coconut-fresh.jpg",
  cotton: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Cotton_field_wadmalaw.jpg/480px-Cotton_field_wadmalaw.jpg",
  jute: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Jute_field_in_Bangladesh.jpg/480px-Jute_field_in_Bangladesh.jpg",
  coffee: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/480px-A_small_cup_of_coffee.JPG",
};

export const CROP_EMOJI: Record<string, string> = {
  rice: "🌾", maize: "🌽", chickpea: "🫘", kidneybeans: "🫘",
  pigeonpeas: "🫘", mothbeans: "🫘", mungbean: "🫘", blackgram: "🫘",
  lentil: "🫘", pomegranate: "🍅", banana: "🍌", mango: "🥭",
  grapes: "🍇", watermelon: "🍉", muskmelon: "🍈", apple: "🍎",
  orange: "🍊", papaya: "🍑", coconut: "🥥", cotton: "⚪",
  jute: "🌿", coffee: "☕",
};

export function getCropImage(crop: string): string {
  return CROP_IMAGES[crop.toLowerCase()] ?? "";
}

export function getCropEmoji(crop: string): string {
  return CROP_EMOJI[crop.toLowerCase()] ?? "🌱";
}
