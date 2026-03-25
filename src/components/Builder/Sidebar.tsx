import { useTranslation } from 'react-i18next';
import { Type, Mail, AlignLeft } from 'lucide-react';
import { Tool } from './Tool';

export const Sidebar = () => {
  const { t } = useTranslation();

  return (
    <div className="w-80 bg-white border-r border-gray-200 shadow-sm flex flex-col h-full z-10">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          {t('builder.tools') || 'Builder Tools'}
        </h2>
      </div>
      <div className="p-4 flex flex-col gap-3 overflow-y-auto">
        <Tool type="text" label={t('fields.text') || 'Text Field'} icon={<Type size={18} />} />
        <Tool type="email" label={t('fields.email') || 'Email Field'} icon={<Mail size={18} />} />
        <Tool type="textarea" label={t('fields.textarea') || 'Textarea'} icon={<AlignLeft size={18} />} />
      </div>
    </div>
  );
};