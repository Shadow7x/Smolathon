import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section
      className="
    w-full 
    pb-[2rem]      
    md:pb-[4rem]         
    lg:h-screen            
    bg-cover bg-center flex text-white px-[2rem] md:px-[4rem] lg:px-[7.5rem]
  "
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0) 80%), url('/images/mainBackground.webp')`,
      }}
    >
      <div
        className="    mt-[8rem]       
    sm:mt-[15rem]    
    md:mt-[17rem]   
    lg:mt-[17.5rem] 
    flex flex-col gap-8 md:gap-12"
      >
        <h1
          className="
    text-[2.5rem] leading-[3rem] 
    sm:text-[5rem] sm:leading-[5.5rem] 
    md:text-[6rem] md:leading-[5.5rem] 
    lg:text-[8rem] lg:leading-[6.6875rem] 
    font-[700] tracking-[0%] align-middle font-bold
  "
        >
          Забота о вашей <br />
          безопасности <br />
          на дорогах
        </h1>
        <div className="flex flex-col md:flex-row gap-3.5">
          <GreenButton href="/statistics">Узнать о проектах</GreenButton>

          <GreenButton href="/projects">Посмотреть статистику</GreenButton>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

export const GreenButton = ({
  className,
  children,
  href,
  ...props
}: React.ComponentProps<typeof Button> & { href?: string }) => {
  if (href) {
    return (
      <Button
        asChild
        className={cn(
          "bg-[#62A744] text-white font-[300] text-[20px] rounded-[20px] px-6 py-3",
          className
        )}
        {...props}
      >
        <Link href={href}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button
      className={cn(
        "bg-[#62A744] text-white font-[300] text-[20px] rounded-[20px] px-6 py-3",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};
