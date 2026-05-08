import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import type { CVData } from '../types';

// No registration needed for standard PDF fonts (Helvetica, Times, Courier)

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#0f172a',
    paddingBottom: 15,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
    marginRight: 20,
  },
  name: {
    fontSize: 26,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontFamily: 'Times-Bold',
    color: '#0f172a',
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactItem: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  photoContainer: {
    width: 90,
    height: 110,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
    marginBottom: 8,
    color: '#0f172a',
  },
  text: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#334155',
  },
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  role: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  period: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  company: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  educationItem: {
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 5,
    gap: 30,
  },
  footerColumn: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 6,
  },
  blueBullet: {
    backgroundColor: '#2563eb',
  },
  grayBullet: {
    backgroundColor: '#cbd5e1',
  },
  listItemText: {
    fontSize: 9,
    color: '#334155',
  }
});

interface CVPDFProps {
  data: CVData;
}

export function CVPDF({ data }: CVPDFProps) {
  const addressParts = [
    data.address?.neighborhood,
    data.address?.city,
    data.address?.state
  ].filter(part => part && part.trim() !== '');
  
  const address = addressParts.join(', ');

  // Filter lists to remove empty strings
  const validSkills = (data.skills || []).filter(s => s && s.trim() !== '');
  const validComplementary = (data.complementary || []).filter(c => c && c.trim() !== '');
  const validExperience = (data.experience || []).filter(exp => exp.role || exp.company || exp.description);
  const validEducation = (data.education || []).filter(edu => edu.degree || edu.institution);

  return (
    <Document title={data.fullName || "Currículo"} author={data.fullName}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{data.fullName || "NOME COMPLETO"}</Text>
            <View style={styles.contactInfo}>
              {data.phone && <Text style={styles.contactItem}>{data.phone}</Text>}
              {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
              {address && <Text style={styles.contactItem}>{address}</Text>}
            </View>
          </View>
          {data.photo && (
            <View style={styles.photoContainer}>
              <Image 
                src={data.photo} 
                style={styles.photo}
              />
            </View>
          )}
        </View>

        {/* Objective */}
        {data.objective && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Objetivo Profissional</Text>
            <Text style={styles.text}>{data.objective}</Text>
          </View>
        )}

        {/* Experience */}
        {validExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experiência Profissional</Text>
            {validExperience.map((exp) => (
              <View key={exp.id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.role}>{exp.role || 'Cargo'}</Text>
                  <Text style={styles.period}>{exp.period || ''}</Text>
                </View>
                {exp.company && <Text style={styles.company}>{exp.company}</Text>}
                <Text style={styles.text}>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {validEducation.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Formação Acadêmica</Text>
            {validEducation.map((edu) => (
              <View key={edu.id} style={styles.educationItem}>
                <View style={styles.experienceHeader}>
                  <Text style={[styles.role, { fontSize: 10 }]}>{edu.degree || 'Curso'}</Text>
                  <Text style={styles.period}>{edu.period || ''}</Text>
                </View>
                {edu.institution && (
                  <Text style={[styles.contactItem, { fontSize: 8.5, marginBottom: 0, color: '#475569' }]}>
                    {edu.institution}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills & Complementary Footer */}
        <View style={styles.footer}>
          {validSkills.length > 0 && (
            <View style={styles.footerColumn}>
              <Text style={styles.sectionTitle}>Habilidades</Text>
              {validSkills.map((skill, i) => (
                <View key={i} style={styles.listItem}>
                  <View style={[styles.bullet, styles.blueBullet]} />
                  <Text style={styles.listItemText}>{skill}</Text>
                </View>
              ))}
            </View>
          )}

          {validComplementary.length > 0 && (
            <View style={styles.footerColumn}>
              <Text style={styles.sectionTitle}>Formação Complementar</Text>
              {validComplementary.map((comp, i) => (
                <View key={i} style={styles.listItem}>
                  <View style={[styles.bullet, styles.grayBullet]} />
                  <Text style={styles.listItemText}>{comp}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

