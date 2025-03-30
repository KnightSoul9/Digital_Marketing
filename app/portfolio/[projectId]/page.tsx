import { notFound } from "next/navigation";
import {projects} from "../../../data/index"

interface ProjectPageProps {
  params: { projectId: string }; // projectId comes as a string from the URL
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const projectId = parseInt(params.projectId, 10); // Convert string to number safely

  if (isNaN(projectId)) return notFound(); // Handle invalid IDs

  const project = projects.find((p) => p.id === projectId);

  if (!project) return notFound(); // Redirect if project not found

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <iframe
        src={project.link}
        className="w-full h-[80vh] border rounded-lg mt-5"
      />
    </div>
  );
}