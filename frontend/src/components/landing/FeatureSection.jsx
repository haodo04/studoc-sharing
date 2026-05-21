import {
  ArrowUpCircle,
  Clock,
  CreditCard,
  FileText,
  Share2,
  Shield,
} from "lucide-react";

const FeatureSection = ({ features }) => {
  const renderIcon = (iconName, iconColor) => {
    const updatedColor = iconColor?.includes('purple') ? 'text-indigo-600' : iconColor;
    const iconProps = { size: 24, className: updatedColor };

    switch (iconName) {
      case "ArrowUpCircle":
        return <ArrowUpCircle {...iconProps} />;
      case "Shield":
        return <Shield {...iconProps} />;
      case "Share2":
        return <Share2 {...iconProps} />;
      case "CreditCard":
        return <CreditCard {...iconProps} />;
      case "FileText":
        return <FileText {...iconProps} />;
      case "Clock":
        return <Clock {...iconProps} />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  return (
    <div className="py-24 bg-slate-50 relative border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
            Everything you need for file sharing
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            CloudShare provides all the tools you need to manage, secure, and distribute your digital content seamlessly.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-transparent transition-all duration-300 hover:-translate-y-1"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-teal-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center p-3 bg-slate-50 group-hover:bg-indigo-50 rounded-xl shadow-sm border border-slate-100 transition-colors duration-300">
                    {renderIcon(feature.iconName, feature.iconColor)}
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-slate-900 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-base text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;