import PageBanner from '../components/PageBanner';

export default function Terms() {
  return (
    <main className="terms-page" id="terms-page">
      <PageBanner title="Terms & Conditions" breadcrumbs={['Home', 'Terms & Conditions']} />
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ background: 'var(--clr-light-bg)', padding: '50px', borderRadius: 'var(--radius-md)' }}>
            <h2 style={{ marginBottom: '20px' }}>1. Terms</h2>
            <p>By accessing this Website, accessible from addina.com, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.</p>
            
            <h2 style={{ marginBottom: '20px', marginTop: '40px' }}>2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials on Addina's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '20px', color: 'var(--clr-body)' }}>
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose or for any public display;</li>
              <li>attempt to reverse engineer any software contained on Addina's Website;</li>
              <li>remove any copyright or other proprietary notations from the materials; or</li>
              <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>

            <h2 style={{ marginBottom: '20px', marginTop: '40px' }}>3. Disclaimer</h2>
            <p>All the materials on Addina's Website are provided "as is". Addina makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Addina does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.</p>

            <h2 style={{ marginBottom: '20px', marginTop: '40px' }}>4. Limitations</h2>
            <p>Addina or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on Addina's Website, even if Addina or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
