import { MessageCircleMoreIcon, RadioIcon } from "lucide-react";

const valuePropositionsArr = [
  {
    title: "Trao đổi thông tin và kiến thức",
    icon: MessageCircleMoreIcon,
    description:
      "Cho phép người dùng có thể chia sẻ và trao đổi thông tin và kiến thức với nhau.",
  },
  {
    title: "Cách cuộc thăm dò ý kiến thời gian thực",
    icon: RadioIcon,
    description:
      "Nhận phản hồi tức thì từ người dùng khác thông qua các cuộc thăm dò ý kiến thời gian thực",
  },
];

const ValuePropositions = () => {
  return (
    <div className="max-w-2xl grid grid-cols-1 px-4 sm:grid-cols-2 gap-8 mt-4">
      {valuePropositionsArr.map(({ title, icon: Icon, description }) => (
        <div key={title} className="flex flex-col items-start gap-y-2">
          <div className="inline-flex items-center gap-x-2">
            <Icon size={24} className="stroke-violet-600" />
            <h2 className="text-xl font-bold text-pretty">{title}</h2>
          </div>

          <p className="text-muted-foreground text-sm text-pretty">
            {description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ValuePropositions;
