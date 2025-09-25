interface StatCardProps {
  value: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, description }) => (
  <div className="bg-[linear-gradient(103.07deg,#C3CC4C_0%,#62A744_67.79%)] rounded-[1.25rem] flex flex-col items-center justify-center p-4 sm:p-6 lg:px-[3.125rem] lg:py-[5.75rem] text-center gap-6">
    <h3 className="font-bold text-[4rem] lg:leading-[1.375rem] text-center">
      {value}
    </h3>
    <p className="font-normal text-[1.25rem] leading-[1.375rem] mt-2">
      {description}
    </p>
  </div>
);

export default StatCard;
