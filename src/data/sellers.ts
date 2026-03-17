export interface SellerProfile {
  id: string;
  name: string;
  avatar: string;
  memberSince: string;
  rating: number;
  totalSales: number;
  bio: string;
  location: string;
}

export const dummySellers: SellerProfile[] = [
  {
    id: "james",
    name: "James",
    avatar: "https://i.pravatar.cc/150?u=james",
    memberSince: "2020",
    rating: 4.9,
    totalSales: 342,
    bio: "Specializing in silver and gold coins from around the world.",
    location: "New York, USA"
  },
  {
    id: "peter",
    name: "Peter",
    avatar: "https://i.pravatar.cc/150?u=peter",
    memberSince: "2018",
    rating: 4.8,
    totalSales: 856,
    bio: "Passionate about ancient Roman and Greek coins. Guaranteed authenticity.",
    location: "London, UK"
  },
  {
    id: "michael",
    name: "Michael",
    avatar: "https://i.pravatar.cc/150?u=michael",
    memberSince: "2021",
    rating: 4.7,
    totalSales: 120,
    bio: "Your premier source for rare and high-grade US coins and vintage replicas.",
    location: "Chicago, USA"
  },
  {
    id: "david",
    name: "David",
    avatar: "https://i.pravatar.cc/150?u=david",
    memberSince: "2015",
    rating: 5.0,
    totalSales: 1240,
    bio: "Offering museum-quality ancient pieces. PCGS and NGC certified.",
    location: "Athens, Greece"
  },
  {
    id: "sarah",
    name: "Sarah",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    memberSince: "2022",
    rating: 4.6,
    totalSales: 89,
    bio: "Curator of exotic banknotes and historic Asian coins.",
    location: "Mumbai, India"
  }
];
