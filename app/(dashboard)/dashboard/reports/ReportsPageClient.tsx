"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import ReportCard from "@/components/reports/ReportCard";
import UploadReportModal from "@/components/reports/UploadReportModal";
import Link from "next/link";

interface ReportsPageClientProps {
  userId: string;
  activeTab: string;
  personalReports: any[];
  teamReports: any[];
  projectReports: any[];
  uploadableTeams: { id: string; name: string; role: string }[];
  uploadableProjects: { id: string; name: string; role: string }[];
}

export default function ReportsPageClient({
  userId,
  activeTab,
  personalReports,
  teamReports,
  projectReports,
  uploadableTeams,
  uploadableProjects,
}: ReportsPageClientProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const tabs = [
    {
      id: "personal",
      label: "Bireysel",
      icon: "heroicons:user",
      count: personalReports.length,
    },
    {
      id: "team",
      label: "Takım",
      icon: "heroicons:user-group",
      count: teamReports.length,
    },
    {
      id: "project",
      label: "Proje",
      icon: "heroicons:folder",
      count: projectReports.length,
    },
  ];

  const getCurrentReports = () => {
    switch (activeTab) {
      case "team":
        return teamReports;
      case "project":
        return projectReports;
      default:
        return personalReports;
    }
  };

  const currentReports = getCurrentReports();

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <nav className="flex items-center text-sm text-slate-500 mb-2">
            <Link
              href="/dashboard"
              className="hover:text-slate-900 transition-colors"
            >
              Dashboard
            </Link>
            <Icon icon="heroicons:chevron-right" className="mx-2 text-xs" />
            <span className="font-semibold text-slate-900">Raporlar</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">Raporlar</h1>
          <p className="text-slate-500 text-sm mt-1">
            Bireysel, takım ve proje raporlarınızı yönetin.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-blue-600/20"
        >
          <Icon icon="heroicons:arrow-up-tray" />
          Rapor Yükle
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/dashboard/reports?tab=${tab.id}`}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px flex items-center gap-2 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon icon={tab.icon} />
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Content */}
      {currentReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              currentUserId={userId}
              showUploader={activeTab !== "personal"}
              showEntity={activeTab !== "personal"}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
            <Icon
              icon="heroicons:document-text"
              className="text-3xl text-slate-300"
            />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {activeTab === "personal"
              ? "Henüz kişisel raporunuz yok"
              : activeTab === "team"
              ? "Takım raporu bulunamadı"
              : "Proje raporu bulunamadı"}
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">
            {activeTab === "personal"
              ? "Kendi raporlarınızı yükleyerek başlayın."
              : activeTab === "team"
              ? "Üye olduğunuz takımların raporları burada görünecek."
              : "Üye olduğunuz projelerin raporları burada görünecek."}
          </p>
          {activeTab === "personal" && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Icon icon="heroicons:plus" />
              İlk Raporunu Yükle
            </button>
          )}
        </div>
      )}

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Icon icon="heroicons:user" className="text-xl text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {personalReports.length}
              </div>
              <div className="text-sm text-slate-500">Kişisel Rapor</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Icon
                icon="heroicons:user-group"
                className="text-xl text-purple-500"
              />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {teamReports.length}
              </div>
              <div className="text-sm text-slate-500">Takım Raporu</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Icon
                icon="heroicons:folder"
                className="text-xl text-amber-500"
              />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {projectReports.length}
              </div>
              <div className="text-sm text-slate-500">Proje Raporu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadReportModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        teams={uploadableTeams}
        projects={uploadableProjects}
      />
    </div>
  );
}
