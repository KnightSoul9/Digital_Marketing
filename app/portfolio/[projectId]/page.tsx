import { notFound } from "next/navigation";
import { projects } from "../../../data/index";
import {
  ArrowLeft,
  ExternalLink,
  Share2,
  BookmarkPlus,
  Eye,
} from "lucide-react";
import Link from "next/link";

interface ProjectPageProps {
  params: { projectId: string }; // projectId comes as a string from the URL
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const projectId = parseInt(params.projectId, 10);

  if (isNaN(projectId)) return notFound();

  const project = projects.find((p) => p.id === projectId);

  if (!project) return notFound();

  // Finding next and previous projects for navigation
  const currentIndex = projects.findIndex((p) => p.id === projectId);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <div className="min-h-screen ">
      {/* Header with navigation */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              href="/#projects"
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Home</span>
            </Link>

            <div className="flex space-x-3">
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Save project"
              >
                <BookmarkPlus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Share project"
              >
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Open in new tab"
              >
                <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project title and metadata */}
        <div className="mb-6">

          {/* <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Eye className="w-4 h-4 mr-1" />
            <span className="mr-4">1.2k views</span>
            {project.date && <span>Published {project.date}</span>}
            {project.tags && (
              <div className="ml-4 flex gap-2">
                {project.id.map((id, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div> */}

          {project.des && (
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-400 mb-2 text-center">
              {project.des}
            </h1>
          )}
        </div>

        {/* The iframe with project content */}
        <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 opacity-50 animate-pulse"></div>
          <iframe
            src={project.link}
            className="relative w-full h-[80vh]  z-10"
            title={project.title || `Project ${project.id}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Previous/Next navigation */}
        <div className="mt-8 flex justify-between">
          {prevProject ? (
            <Link
              href={`/portfolio/${prevProject.id}`}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm">Previous Project</span>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link
              href={`/portfolio/${nextProject.id}`}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <span className="text-sm">Next Project</span>
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  );
}
