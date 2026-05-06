export default function handler(req, res) {

  res.status(200).json([
    {
      title: "HTML & CSS",
      description: "Basics of web design"
    },

    {
      title: "JavaScript",
      description: "Logic & interaction"
    },

    {
      title: "React",
      description: "Frontend framework"
    }
  ]);

}