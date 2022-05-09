#include "mkl25z4.h"

#define MASK(X) (1UL << X)
#define OBL (1)
#define SIREN (2)
#define ORL (18) // onboard red led
#define FLASH_SLEEP_500 (500)
#define SIREN_SLEEP_300 (300)
#define SIREN_SLEEP_900 (900)

void SysTick_Handler(void);
unsigned long now(void);
void init(void);
void siren(void);
void alternate_blink(void);

volatile unsigned long counter = 0;

int main()
{
    init();
    while (1)
    {
        siren();
        alternate_blink();
    }
}

void init(void)
{
    SIM->SCGC5 |= SIM_SCGC5_PORTB_MASK | SIM_SCGC5_PORTD_MASK;

    PORTB->PCR[ORL] &= PORT_PCR_MUX_MASK;
    PORTB->PCR[ORL] |= PORT_PCR_MUX(1);
    PORTD->PCR[OBL] &= PORT_PCR_MUX_MASK;
    PORTD->PCR[OBL] |= PORT_PCR_MUX(1);
    PORTD->PCR[SIREN] &= PORT_PCR_MUX_MASK;
    PORTD->PCR[SIREN] |= PORT_PCR_MUX(1);

    PTB->PDDR |= MASK(ORL);
    PTD->PDDR |= MASK(OBL);
    PTD->PDDR |= MASK(SIREN);

    PTB->PSOR |= MASK(ORL);
    PTD->PSOR |= MASK(OBL);
    PTD->PCOR |= MASK(SIREN);

    SysTick->LOAD = (20971520u / 1000u) - 1;
    SysTick->CTRL |= SysTick_CTRL_CLKSOURCE_Msk |
                     SysTick_CTRL_ENABLE_Msk | SysTick_CTRL_TICKINT_Msk;
}
void siren(void)
{
    enum states
    {
        ON_SIREN,
        OFF_SIREN,
        SLEEP_900,
        SLEEP_300,
        ON_SIREN_2,
        OFF_SIREN_2,
        SLEEP_300_1
    };
    static enum states go_to = ON_SIREN;
    static power_state = 0; // 1 = On, 0 = off
    unsigned long current_time = 0u;
    static unsigned long last_run = 0u;
    unsigned long sleep_300 = SIREN_SLEEP_300;
    unsigned long sleep_900 = SIREN_SLEEP_900;
    switch (go_to)
    {
    case ON_SIREN:
        PTD->PSOR |= MASK(SIREN);
        go_to = SLEEP_300;
        power_state = 1;
        break;

    case SLEEP_300:
        current_time = now();
        if ((current_time - last_run) >= sleep_300)
        {
            last_run = current_time;
            go_to = power_state == 1 ? OFF_SIREN : ON_SIREN_2;
        }
        break;
    case OFF_SIREN:
        PTD->PCOR |= MASK(SIREN);
        go_to = SLEEP_300;
        power_state = 0;
        break;

    case ON_SIREN_2:
        PTD->PSOR |= MASK(SIREN);
        go_to = SLEEP_300_1;
        break;

    case SLEEP_300_1:
        current_time = now();
        if ((current_time - last_run) >= sleep_300)
        {
            last_run = current_time;
            go_to = OFF_SIREN_2;
        }
        break;

    case OFF_SIREN_2:
        PTD->PCOR |= MASK(SIREN);
        go_to = SLEEP_900;
        break;

    case SLEEP_900:
        current_time = now();
        if ((current_time - last_run) >= sleep_900)
        {
            last_run = current_time;
            go_to = ON_SIREN;
        }
        break;

    default:
        go_to = ON_SIREN;
        break;
    }
}

void alternate_blink(void)
{
    enum states
    {
        ON_ORL,
        FLASH_SLEEP,
        OFF_ORL,
        ON_OBL,
        OFF_OBL
    };

    static enum states go_to = ON_ORL;
    static acative_led = ORL; // orl or obl
    unsigned long current_time = 0u;
    static unsigned long last_run = 0u;
    unsigned long interval = FLASH_SLEEP_500;

    switch (go_to)
    {
    case ON_ORL:
        PTB->PCOR |= MASK(ORL);
        go_to = FLASH_SLEEP;
        acative_led = ORL;
        break;

    case FLASH_SLEEP:
        current_time = now();
        if ((current_time - last_run) >= interval)
        {
            last_run = current_time;
            go_to = acative_led == ORL ? OFF_ORL : OFF_OBL;
        }
        break;
    case OFF_ORL:
        PTB->PSOR |= MASK(ORL);
        go_to = ON_OBL;
        break;

    case ON_OBL:
        PTD->PCOR |= MASK(OBL);
        go_to = FLASH_SLEEP;
        acative_led = OBL;
        break;

    case OFF_OBL:
        PTD->PSOR |= MASK(OBL);
        go_to = ON_ORL;
        break;

    default:
        go_to = ON_ORL;
        break;
    }
}

void SysTick_Handler(void)
{
    counter++;
}
unsigned long now(void)
{
    return (unsigned long)counter;
}
