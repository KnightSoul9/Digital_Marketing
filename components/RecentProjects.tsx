"use client";

import React, { memo, useMemo } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import Image from "next/image";
import { projects } from "@/data";
import { PinContainer } from "./ui/Pin";
import { useRouter } from "next/navigation";

interface Project {
  id: number;
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link?: string;
}

interface ProjectIconProps {
  icon: string;
  index: number;
}

// Memoized component for project icons
const ProjectIcon = memo(({ icon, index }: ProjectIconProps) => (
  <div
    className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
    style={{
      transform: `translateX(-${5 * index + 2}px)`,
    }}
  >
    <Image
      src={icon}
      alt={`icon-${index}`}
      width={24}
      height={24}
      className="p-2"
      loading="lazy"
    />
  </div>
));

ProjectIcon.displayName = "ProjectIcon";

// Memoized project card component
const ProjectCard = memo(({ project }: { project: Project }) => {
  const router = useRouter(); // Initialize Next.js router

  // Function to handle project click
  const handleProjectClick = () => {
    router.push(`/portfolio/${project.id}`);
  };

  return (
    <div
      className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw] cursor-pointer"
      key={project.id}
      onClick={handleProjectClick} // Attach click event
    >
      <PinContainer title={project.title} href="#">
        <div className="relative flex items-center justify-center sm:w-96 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10">
          <div
            className="relative w-full h-full overflow-hidden lg:rounded-3xl"
            style={{ backgroundColor: "#13162D" }}
          >
            <Image
              src="/bg.png"
              alt="Background image"
              fill
              sizes="(max-width: 768px) 80vw, 384px"
              className="object-cover"
              priority={false}
            />
          </div>
          <Image
            src={project.img}
            alt={`${project.title} preview`}
            width={500}
            height={300}
            className="z-10 absolute bottom-0"
          />
        </div>

        <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
          {project.title}
        </h1>

        <p
          className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
          style={{
            color: "#BEC1DD",
            margin: "1vh 0",
          }}
        >
          {project.des}
        </p>

        <div className="flex items-center justify-between mt-7 mb-3">
          <div className="flex items-center">
            {project.iconLists.map((icon, index) => (
              <ProjectIcon key={index} icon={icon} index={index} />
            ))}
          </div>

          <div className="flex justify-center items-center">
            <p className="flex lg:text-xl md:text-xs text-sm text-purple">
              Check Live Site
            </p>
            <FaLocationArrow className="ms-3" color="#CBACF9" />
          </div>
        </div>
      </PinContainer>
    </div>
  );
});

ProjectCard.displayName = "ProjectCard";

const RecentProjects = () => {
  // Memoize the projects data to prevent unnecessary recalculations
  const memoizedProjects = useMemo(() => projects, []);

  return (
    <section className="py-20" id="projects">
      <h1 className="heading">
        A small selection of{" "}
        <span className="text-purple">recent projects</span>
      </h1>
      <div className="flex flex-wrap items-center justify-center p-4 gap-16 mt-10">
        {memoizedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default memo(RecentProjects);
