/* ============================================
   MAZE Roofing & Construction
   Commercial Roof Coatings Landing Page
   JavaScript — URL Params, Dynamic Content,
   Form Validation, Tracking, Attribution
   ============================================ */

(function () {
  'use strict';

  /* ---- Configuration ---- */
  const CONFIG = {
    // Supported URL parameters
    params: [
      'service', 'location', 'building', 'issue', 'keyword',
      'campaign', 'utm_source', 'utm_medium', 'utm_campaign',
      'utm_term', 'utm_content'
    ],
    // localStorage key for first-touch attribution
    storageKey: 'maze_attribution',
    // Form endpoint placeholder
    // formEndpoint: 'https://your-endpoint.com/api/leads',
    // HubSpot portal/form IDs placeholder
    // hubspotPortalId: 'XXXXXXX',
    // hubspotFormId: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  };

  /* ============================================
     URL PARAMETER PARSING
     ============================================ */

  /**
   * Parse URL parameters into a plain object.
   * Returns only recognized params with sanitized values.
   */
  function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    CONFIG.params.forEach(key => {
      const val = urlParams.get(key);
      if (val) {
        // Sanitize: strip HTML/script tags, trim whitespace
        params[key] = val.replace(/<[^>]*>/g, '').trim();
      }
    });
    return params;
  }

  /**
   * Format a slug parameter into readable text.
   * e.g. "silicone-roof-coating" → "Silicone Roof Coating"
   */
  function formatParam(slug) {
    if (!slug) return '';
    return slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  /* ============================================
     DYNAMIC CONTENT ENGINE
     ============================================ */

  /**
   * Build dynamic content variants based on URL parameters.
   * Returns an object mapping data-dynamic keys to content strings.
   */
  function buildDynamicContent(params) {
    const service = params.service || '';
    const location = params.location || '';
    const building = params.building || '';
    const issue = params.issue || '';

    const serviceText = formatParam(service);
    const locationText = formatParam(location);
    const buildingText = formatParam(building);
    const issueText = formatParam(issue);

    // Location display — default to "North Texas"
    const locationDisplay = locationText || 'North Texas';
    const locationArea = locationText
      ? `${locationText} and the surrounding North Texas area`
      : 'the North Texas region';

    // Service display — default to "Commercial Roof Coatings"
    const serviceDisplay = serviceText || 'Commercial Roof Coatings';

    const content = {};

    // --- Headline ---
    if (service && location) {
      content.headline = `${serviceDisplay} for Commercial Properties in ${locationDisplay}`;
    } else if (service) {
      content.headline = `${serviceDisplay} for North Texas Commercial Properties`;
    } else if (location) {
      content.headline = `Commercial Roof Coatings for ${locationDisplay} Properties`;
    }
    // else: keep HTML default

    // --- Subheadline ---
    if (building) {
      content.subheadline = `Extend the life of your ${buildingText.toLowerCase()} roof, reduce operational disruption, and make informed decisions about coating vs. replacement — backed by an honest, on-site evaluation.`;
    }

    // --- CTA ---
    if (service && service.includes('coating')) {
      content.cta = 'Get Coating Estimate';
    } else if (service === 'roof-restoration') {
      content.cta = 'Schedule Evaluation';
    }

    // --- Form Intro ---
    if (location) {
      content['form-intro'] = `Request a Commercial Roof Evaluation in ${locationDisplay}`;
    }

    // --- Trust Location ---
    if (location) {
      content['trust-location'] = `Serving ${locationDisplay} &amp; North Texas`;
    }

    // --- Trust Statement ---
    if (location) {
      content['trust-statement'] = `We're based in Dallas and serve commercial properties throughout ${locationArea}. We know the climate, the building codes, and the challenges that come with maintaining roofs in this market.`;
    }

    // --- Issue-Specific Message ---
    const issueMessages = {
      'roof-leaks': 'If your commercial roof is experiencing leaks, a coating system may help — provided the underlying structure is still sound. We evaluate the source and extent of moisture intrusion before recommending any solution.',
      'aging-roof': 'Aging roofs that haven\'t yet reached the point of structural failure are often strong candidates for a coating system. We\'ll assess your roof\'s remaining service life and determine if restoration makes sense.',
      'ponding-water': 'Standing water on low-slope commercial roofs accelerates membrane degradation. Certain coating systems are formulated to perform in ponding conditions, but proper drainage evaluation is essential before application.',
      'weathering': 'UV exposure, temperature cycling, and weather events take a toll on commercial roofing systems over time. A professionally applied coating can restore surface protection and extend the roof\'s functional life.',
      'energy-loss': 'Reflective roof coatings can help reduce heat absorption and lower cooling demands in commercial buildings. We\'ll evaluate whether a cool-roof coating system is practical for your property and climate exposure.'
    };

    if (issue && issueMessages[issue]) {
      content['issue-message'] = issueMessages[issue];
    }

    // --- Building-Type Message ---
    const buildingMessages = {
      'warehouse': 'Large-footprint warehouse and distribution facilities often benefit significantly from coating systems — the cost savings over full replacement scale with roof size, and application typically allows operations to continue uninterrupted.',
      'office-building': 'Office building owners and property managers value coating systems for their ability to extend roof life with minimal tenant disruption. No evacuation, no tear-off debris, and reduced noise during application.',
      'retail-center': 'Retail center roofs face constant exposure and foot traffic from HVAC maintenance. Coating systems can restore protection across large multi-tenant roof areas without disrupting store operations below.',
      'industrial-facility': 'Industrial facilities often have complex roof profiles with heavy equipment, penetrations, and exhaust systems. We evaluate the full roof environment before recommending a coating approach.',
      'multi-family': 'Multi-family property roofs protect tenants and your investment. A coating system can extend roof life and improve weather resistance without the cost and disruption of a full replacement project.'
    };

    if (building && buildingMessages[building]) {
      content['building-message'] = buildingMessages[building];
    }

    // --- Dynamic Bullets ---
    if (building) {
      content['bullet-4'] = `Serving ${buildingText.toLowerCase()} properties across ${locationDisplay}`;
    }

    if (issue === 'ponding-water') {
      content['bullet-2'] = 'Address ponding water and surface degradation';
    } else if (issue === 'roof-leaks') {
      content['bullet-2'] = 'Identify and address the source of roof leaks';
    } else if (issue === 'energy-loss') {
      content['bullet-2'] = 'Improve energy efficiency with reflective coatings';
    }

    return content;
  }

  /**
   * Apply dynamic content to the DOM.
   * Matches elements with data-dynamic attributes to content keys.
   */
  function applyDynamicContent(content) {
    Object.keys(content).forEach(key => {
      const elements = document.querySelectorAll(`[data-dynamic="${key}"]`);
      elements.forEach(el => {
        if (el.tagName === 'INPUT') {
          el.value = content[key];
        } else {
          el.innerHTML = content[key];
        }
      });
    });
  }

  /* ============================================
     ATTRIBUTION & TRACKING
     ============================================ */

  /**
   * Store first-touch attribution data in localStorage.
   * Merges with existing data — first-touch params are preserved,
   * current visit params are stored as "last_" variants.
   */
  function handleAttribution(params) {
    const attribution = {
      referrer: document.referrer || '(direct)',
      landing_page_url: window.location.href,
      page_variant: generatePageVariant(params),
      first_visit: new Date().toISOString(),
      ...params
    };

    try {
      const stored = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '{}');

      // If first-touch data exists, preserve it and add current as last-touch
      if (stored.first_visit) {
        // Keep first-touch data
        const merged = { ...stored };
        // Add current visit as last-touch
        CONFIG.params.forEach(key => {
          if (params[key]) {
            merged['last_' + key] = params[key];
          }
        });
        merged.last_referrer = document.referrer || '(direct)';
        merged.last_landing_page_url = window.location.href;
        merged.last_visit = new Date().toISOString();
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(merged));
        return merged;
      } else {
        // First visit — store everything
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(attribution));
        return attribution;
      }
    } catch (e) {
      // localStorage unavailable — continue with current params
      return attribution;
    }
  }

  /**
   * Generate a page_variant identifier based on active dynamic conditions.
   */
  function generatePageVariant(params) {
    const parts = [];
    if (params.service) parts.push('s:' + params.service);
    if (params.location) parts.push('l:' + params.location);
    if (params.building) parts.push('b:' + params.building);
    if (params.issue) parts.push('i:' + params.issue);
    return parts.length > 0 ? parts.join('|') : 'default';
  }

  /**
   * Populate hidden form fields with attribution data.
   */
  function populateHiddenFields(params, attribution) {
    // Direct URL params
    CONFIG.params.forEach(key => {
      const field = document.getElementById('h_' + key);
      if (field) {
        field.value = params[key] || '';
      }
    });

    // Meta fields
    const refField = document.getElementById('h_referrer');
    if (refField) refField.value = attribution.referrer || document.referrer || '';

    const urlField = document.getElementById('h_landing_page_url');
    if (urlField) urlField.value = window.location.href;

    const variantField = document.getElementById('h_page_variant');
    if (variantField) variantField.value = attribution.page_variant || 'default';
  }

  /* ============================================
     TRACKING EVENT STUBS
     ============================================ */

  /**
   * Fire a tracking event. This is a stub for integration with
   * GTM, GA4, Google Ads, HubSpot, etc.
   */
  function trackEvent(eventName, eventData) {
    // Console log for development/debugging
    console.log('[MAZE Tracking]', eventName, eventData || {});

    /* --- Google Tag Manager / dataLayer push ---
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...eventData
    });
    */

    /* --- GA4 gtag event ---
    if (typeof gtag === 'function') {
      gtag('event', eventName, eventData);
    }
    */

    /* --- Google Ads Conversion ---
    if (eventName === 'commercial_roof_coating_form_submit') {
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          send_to: 'AW-XXXXXXXXXX/XXXXXXXXXXXXXXXXXXXX',
          value: 1.0,
          currency: 'USD'
        });
      }
    }
    */

    /* --- HubSpot Form Submission ---
    if (eventName === 'commercial_roof_coating_form_submit') {
      // HubSpot forms API integration would go here
      // See: https://legacydocs.hubspot.com/docs/methods/forms/submit_form
    }
    */
  }

  /* ============================================
     FORM VALIDATION
     ============================================ */

  const validators = {
    fullName: {
      validate: (val) => val.trim().length >= 2,
      message: 'Please enter your full name.'
    },
    companyName: {
      validate: (val) => val.trim().length >= 2,
      message: 'Please enter your company name.'
    },
    phone: {
      validate: (val) => {
        const digits = val.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
      },
      message: 'Please enter a valid phone number.'
    },
    email: {
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      message: 'Please enter a valid email address.'
    },
    propertyAddress: {
      validate: (val) => val.trim().length >= 2,
      message: 'Please enter the property address or city.'
    },
    propertyType: {
      validate: (val) => val !== '',
      message: 'Please select a property type.'
    },
    projectDetails: {
      validate: (val) => val.length <= 1000,
      message: 'Please keep project details under 1,000 characters.'
    }
  };

  /**
   * Validate a single field. Shows/hides error state.
   * Returns true if valid.
   */
  function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    const rule = validators[fieldId];

    if (!field || !rule) return true;

    // Skip validation for optional empty fields
    if (!field.required && !field.value) return true;

    const isValid = rule.validate(field.value);

    if (!isValid) {
      field.classList.add('error');
      if (errorEl) errorEl.textContent = rule.message;
    } else {
      field.classList.remove('error');
      if (errorEl) errorEl.textContent = '';
    }

    return isValid;
  }

  /**
   * Validate all form fields.
   * Returns true if all pass.
   */
  function validateForm() {
    const fields = ['fullName', 'companyName', 'phone', 'email', 'propertyAddress', 'propertyType', 'projectDetails'];
    let allValid = true;
    let firstInvalid = null;

    fields.forEach(fieldId => {
      const isValid = validateField(fieldId);
      if (!isValid && !firstInvalid) {
        firstInvalid = document.getElementById(fieldId);
      }
      if (!isValid) allValid = false;
    });

    // Scroll to first invalid field
    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return allValid;
  }

  /**
   * Normalize phone number to (XXX) XXX-XXXX format for US numbers.
   */
  function normalizePhone(input) {
    const digits = input.replace(/\D/g, '');
    // Remove leading 1 for US numbers
    const cleaned = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return input; // Return original if can't normalize
  }

  /* ============================================
     FORM SUBMISSION HANDLER
     ============================================ */

  function handleFormSubmit(e) {
    e.preventDefault();

    // Track attempt
    trackEvent('form_submit_attempt', { location: 'hero-form' });

    // Validate
    if (!validateForm()) {
      trackEvent('form_validation_failed', { location: 'hero-form' });
      return;
    }

    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');

    // Normalize phone before submission
    const phoneField = document.getElementById('phone');
    if (phoneField) {
      phoneField.value = normalizePhone(phoneField.value);
    }

    // Set loading state
    submitBtn.classList.add('loading');

    // Collect form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((val, key) => { data[key] = val; });

    // Add timestamp
    data.submitted_at = new Date().toISOString();

    console.log('[MAZE] Form submission data:', data);

    /* --- Backend Integration Placeholder ---
    fetch(CONFIG.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) throw new Error('Submission failed');
      return response.json();
    })
    .then(result => {
      showSuccessState();
      trackEvent('commercial_roof_coating_form_submit', {
        property_type: data.propertyType,
        location: data.location || 'not-set',
        service: data.service || 'not-set'
      });
    })
    .catch(error => {
      console.error('[MAZE] Form error:', error);
      submitBtn.classList.remove('loading');
      alert('Something went wrong. Please call us at (214) 214-6293.');
    });
    */

    // Simulated success (remove when real endpoint is connected)
    setTimeout(() => {
      showSuccessState();
      trackEvent('commercial_roof_coating_form_submit', {
        property_type: data.propertyType,
        location: data.location || 'not-set',
        service: data.service || 'not-set'
      });
    }, 1200);
  }

  /**
   * Show the form success state UI.
   */
  function showSuccessState() {
    const form = document.getElementById('coatingForm');
    const success = document.getElementById('formSuccess');
    const header = document.querySelector('.form-card-header');

    if (form) form.hidden = true;
    if (header) header.hidden = true;
    if (success) success.hidden = false;

    // Scroll to success message
    if (success) {
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /* ============================================
     CLICK TRACKING
     ============================================ */

  function initClickTracking() {
    // Track all elements with data-track attribute
    document.addEventListener('click', function (e) {
      const tracked = e.target.closest('[data-track]');
      if (!tracked) return;

      const eventName = tracked.getAttribute('data-track');
      const location = tracked.getAttribute('data-location') || 'unknown';

      trackEvent(eventName, {
        location: location,
        element_text: tracked.textContent.trim().substring(0, 50),
        element_href: tracked.href || null
      });
    });
  }

  /* ============================================
     HEADER SCROLL BEHAVIOR
     ============================================ */

  function initStickyHeader() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 10) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ============================================
     INLINE VALIDATION ON BLUR
     ============================================ */

  function initInlineValidation() {
    const form = document.getElementById('coatingForm');
    if (!form) return;

    const fields = form.querySelectorAll('input[required], select[required]');
    fields.forEach(field => {
      field.addEventListener('blur', function () {
        // Only validate if user has interacted (field has value or was touched)
        if (this.value) {
          validateField(this.id);
        }
      });

      // Clear error on input
      field.addEventListener('input', function () {
        if (this.classList.contains('error')) {
          this.classList.remove('error');
          const errorEl = document.getElementById(this.id + '-error');
          if (errorEl) errorEl.textContent = '';
        }
      });
    });

    // Phone auto-formatting
    const phoneField = document.getElementById('phone');
    if (phoneField) {
      phoneField.addEventListener('input', function () {
        const digits = this.value.replace(/\D/g, '');
        if (digits.length >= 10) {
          const cleaned = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
          if (cleaned.length === 10) {
            this.value = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
          }
        }
      });
    }
  }

  /* ============================================
     SMART CTA SCROLL + FORM HIGHLIGHT
     ============================================ */

  /**
   * Check if an element is currently visible in the viewport.
   */
  function isElementInView(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    // Consider it "in view" if at least the top portion is visible
    return rect.top < windowHeight && rect.bottom > 0;
  }

  /**
   * Highlight the form card with a pulse animation to draw attention.
   */
  function highlightForm() {
    const formCard = document.querySelector('.form-card');
    if (!formCard) return;
    // Remove class first in case it's already animating
    formCard.classList.remove('highlight');
    // Force reflow to restart animation
    void formCard.offsetWidth;
    formCard.classList.add('highlight');
    // Focus the first visible input
    const firstInput = document.getElementById('fullName');
    if (firstInput) firstInput.focus({ preventScroll: true });
  }

  function initSmartCTAScroll() {
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // If the target (form) is already in view, just highlight it
      if (isElementInView(target)) {
        highlightForm();
      } else {
        // Scroll to the form, then highlight after arrival
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Highlight after scroll completes (approximate)
        setTimeout(highlightForm, 600);
      }
    });
  }

  /* ============================================
     INITIALIZATION
     ============================================ */

  function init() {
    // 1. Parse URL parameters
    const params = getUrlParams();

    // 2. Build and apply dynamic content
    const content = buildDynamicContent(params);
    applyDynamicContent(content);

    // 3. Handle attribution (first-touch + last-touch)
    const attribution = handleAttribution(params);

    // 4. Populate hidden form fields
    populateHiddenFields(params, attribution);

    // 5. Bind form submit
    const form = document.getElementById('coatingForm');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }

    // 6. Initialize UI behaviors
    initClickTracking();
    initStickyHeader();
    initInlineValidation();
    initSmartCTAScroll();

    // 7. Fire page view event
    trackEvent('landing_page_view', {
      page_variant: generatePageVariant(params),
      service: params.service || 'default',
      location: params.location || 'default'
    });

    console.log('[MAZE] Landing page initialized', {
      params,
      variant: generatePageVariant(params),
      dynamicKeys: Object.keys(content)
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();