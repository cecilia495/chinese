type Topic = {
  id: string;
  name: string;
  english: string;
  open: boolean;
};

const curriculum = [
  ["人物与自我介绍", ["姓名国籍与身份|Names and identity", "年龄生日与个人信息|Age and birthdays", "外貌穿着与人物特点|Appearance", "性格情绪与兴趣爱好|Personality and interests"]],
  ["家庭与人际交往", ["家庭成员与亲属关系|Family", "朋友同学与邻居|Friends and neighbors", "认识朋友与邀请见面|Meeting and inviting", "礼貌祝福与人际沟通|Greetings and wishes"]],
  ["时间与日常安排", ["日期星期与时间|Dates and time", "日常作息与生活习惯|Daily routines", "计划约定与活动安排|Making plans", "事情经过变化与简单经历|Talking about experiences"]],
  ["饮食与餐厅", ["食物水果与饮料|Food and drink", "饮食喜好与口味|Food preferences", "餐厅点餐与就餐服务|Ordering at a restaurant", "做饭餐具与中国饮食|Cooking and tableware"]],
  ["购物与消费", ["常见物品与商品|Everyday goods", "衣服颜色与商品特点|Clothes and colors", "价格数量与购买选择|Prices and quantities", "商品比较付款与购物体验|Comparing and paying"]],
  ["交通与旅行", ["交通工具与出行方式|Getting around", "地点方位与问路指路|Asking for directions", "车票乘车与行程安排|Tickets and itineraries", "旅行景点与住宿|Sightseeing and lodging"]],
  ["学校与学习", ["学校教室与校园设施|School and campus", "课程学科与学习用品|Subjects and supplies", "上课作业与考试|Classes and exams", "学习方法学习经历与留学|Learning and study abroad"]],
  ["职业与工作", ["职业身份与工作地点|Jobs and workplaces", "工作时间与日常事务|Working hours and duties", "办公室同事与职场交流|Workplace communication", "工作经历感受与职业选择|Careers and experience"]],
  ["居住与城市生活", ["住房房间与居家环境|Housing and rooms", "家具生活用品与家务|Household items and chores", "社区邻居与周边设施|The neighborhood", "城市公共场所与办事求助|Public services and asking for help"]],
  ["身体健康与运动", ["身体部位与身体状态|Body and health", "生病看病与用药|Seeing a doctor", "健康习惯与生活方式|Healthy habits", "运动健身与体育活动|Sports and exercise"]],
  ["休闲自然与环境", ["休闲娱乐与文艺活动|Leisure and the arts", "天气季节与气候|Weather and seasons", "动物植物与自然风景|Wildlife and landscapes", "环境特点城市生活与环保|Urban environment and conservation"]],
  ["文化节日与现代生活", ["节日庆祝与传统习俗|Festivals and traditions", "中国特色饮食与生活文化|Chinese food culture", "称谓礼仪与文化差异|Forms of address and etiquette", "手机网络与现代生活|Phones and online life"]],
] as const;

export const diningTopicId = "04-03";
export const topicDomains = curriculum.map(([name, topics], index) => {
  const id = String(index + 1).padStart(2, "0");
  return {
    id, name,
    topics: topics.map((label, position): Topic => {
      const topicId = `${id}-0${position + 1}`;
      const [name, english] = label.split("|");
      return { id: topicId, name, english, open: topicId === diningTopicId };
    }),
  };
});
